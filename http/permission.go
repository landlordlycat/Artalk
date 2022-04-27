package http

import (
	"encoding/json"
	"fmt"
	"path"
	"strconv"
	"strings"
	"time"

	"github.com/ArtalkJS/ArtalkGo/config"
	"github.com/ArtalkJS/ArtalkGo/lib"
	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var CommonJwtConfig middleware.JWTConfig

// jwtCustomClaims are custom claims extending default ones.
// See https://github.com/golang-jwt/jwt for more examples
type jwtCustomClaims struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	IsAdmin bool   `json:"is_admin"`
	jwt.StandardClaims
}

type Skipper func(echo.Context) bool
type ActionLimitConf struct {
	ProtectPaths []string
}

// 操作限制 中间件
func ActionLimitMiddleware(conf ActionLimitConf) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// 关闭验证码功能

			// 路径是否启用操作限制
			pathInList := false
			for _, p := range conf.ProtectPaths {
				if path.Clean(c.Request().URL.Path) == path.Clean(p) {
					pathInList = true
					break
				}
			}
			if !pathInList {
				// 不启用的 path 直接放行
				return next(c)
			}

			// 管理员直接放行
			if CheckIsAdminReq(c) {
				return next(c)
			}

			userIP := c.RealIP()
			isNeedCheck := IsReqNeedCaptchaCheck(c)

			// 总是需要验证码模式
			if config.Instance.Captcha.Always {
				if GetAlwaysCaptchaMode_Pass(userIP) {
					SetAlwaysCaptchaMode_Pass(userIP, false) // 总是需要验证码，放行一次后再次需要验证码
					isNeedCheck = false
				} else {
					isNeedCheck = true
				}
			} else {
				// 超时模式：重置计数
				if config.Instance.Captcha.ActionReset != -1 {
					if !IsActionInTimeFrame(c) { // 超时
						ResetActionRecord(c) // 重置计数
						isNeedCheck = false  // 放行
					}
				}
			}

			// 是否需要验证
			if isNeedCheck {
				respData := Map{
					"need_captcha": true,
				}

				if config.Instance.Captcha.Geetest.Enabled {
					// iframe 验证模式
					respData["iframe"] = true
					// 前端新版不会再用到 img_data，给旧版响应 ArtalkFrontent out-of-date 图片
					respData["img_data"] = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 40'%3E%3Cdefs%3E%3Cstyle%3E.a%7Bfill:%23328ce6%3B%7D.b%7Bfont-size:12px%3Bfill:%23fff%3Bfont-family:sans-serif%3B%7D%3C/style%3E%3C/defs%3E%3Crect class='a' width='160' height='40'/%3E%3Ctext class='b' transform='translate(18.37 16.67)'%3EArtalk Frontend%3Ctspan x='0' y='14.4'%3EOut-Of-Date.%3C/tspan%3E%3C/text%3E%3C/svg%3E"
				} else {
					respData["img_data"] = GetNewImageCaptchaBase64(c.RealIP())
				}

				return RespError(c, "需要验证码", respData)
			}

			// 放行
			return next(c)
		}
	}
}

// 请求是否需要验证码
func IsReqNeedCaptchaCheck(c echo.Context) bool {
	captchaConf := config.Instance.Captcha

	// 管理员直接忽略
	if CheckIsAdminReq(c) {
		return false
	}

	// 总是需要验证码模式
	if config.Instance.Captcha.Always {
		return !GetAlwaysCaptchaMode_Pass(c.RealIP())
	}

	// 不重置计数器模式
	if captchaConf.ActionReset == -1 {
		if getActionCount(c) >= captchaConf.ActionLimit { // 只要操作次数超过
			return true // 就过限
		} else {
			return false // 放行
		}
	}

	// 开启重置计数器功能的情况：在时间范围内，操作次数超过
	if IsActionInTimeFrame(c) && getActionCount(c) >= captchaConf.ActionLimit {
		return true // 过限
	} else {
		return false // 放行
	}
}

// 记录操作
func RecordAction(c echo.Context) {
	updateActionLastTime(c) // 更新最后操作时间
	addActionCount(c)       // 操作次数 +1
}

// 重置操作记录
func ResetActionRecord(c echo.Context) {
	ip := c.RealIP()

	lib.CACHE_marshal.Delete(lib.Ctx, "action-time:"+ip)
	lib.CACHE_marshal.Delete(lib.Ctx, "action-count:"+ip)
}

// 操作计数是否应该被重置
func IsActionInTimeFrame(c echo.Context) bool {
	return time.Since(getActionLastTime(c)).Seconds() <= float64(config.Instance.Captcha.ActionReset)
}

// 修改最后操作时间
func updateActionLastTime(c echo.Context) {
	curtTime := fmt.Sprintf("%v", time.Now().Unix())
	lib.CACHE_marshal.Set(lib.Ctx, "action-time:"+c.RealIP(), curtTime, nil)
}

// 获取最后操作时间
func getActionLastTime(c echo.Context) time.Time {
	var timestamp int64
	var val string
	if _, err := lib.CACHE_marshal.Get(lib.Ctx, "action-time:"+c.RealIP(), &val); err == nil {
		timestamp, _ = strconv.ParseInt(string(val), 10, 64)
	}
	tm := time.Unix(timestamp, 0)
	return tm
}

// 获取操作次数
func getActionCount(c echo.Context) int {
	count := 0
	var val string
	if _, err := lib.CACHE_marshal.Get(lib.Ctx, "action-count:"+c.RealIP(), &val); err == nil {
		count, _ = strconv.Atoi(val)
	}

	return count
}

// 修改操作次数
func setActionCount(c echo.Context, num int) {
	lib.CACHE_marshal.Set(lib.Ctx, "action-count:"+c.RealIP(), fmt.Sprintf("%d", num), nil)
}

// 操作次数 +1
func addActionCount(c echo.Context) {
	setActionCount(c, getActionCount(c)+1)
}

func GetJwtInstanceByReq(c echo.Context) *jwt.Token {
	token := c.QueryParam("token")
	if token == "" {
		token = c.FormValue("token")
	}
	if token == "" {
		token = c.Request().Header.Get("Authorization")
		token = strings.TrimPrefix(token, "Bearer ")
	}
	if token == "" {
		return nil
	}

	jwt, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		if t.Method.Alg() != CommonJwtConfig.SigningMethod {
			return nil, fmt.Errorf("unexpected jwt signing method=%v", t.Header["alg"])
		}

		return []byte(config.Instance.AppKey), nil // 密钥
	})
	if err != nil {
		return nil
	}

	return jwt
}

func CheckIsAdminByJwt(jwt *jwt.Token) bool {
	user := GetUserByJwt(jwt)

	return user.IsAdmin
}

func CheckIsAdminReq(c echo.Context) bool {
	jwt := GetJwtInstanceByReq(c)
	if jwt == nil {
		return false
	}

	return CheckIsAdminByJwt(jwt)
}

func GetUserByJwt(jwt *jwt.Token) jwtCustomClaims {
	if jwt == nil {
		return jwtCustomClaims{}
	}

	claims := jwtCustomClaims{}
	tmp, _ := json.Marshal(jwt.Claims)
	_ = json.Unmarshal(tmp, &claims)

	return claims
}

func GetUserByReqToken(c echo.Context) jwtCustomClaims {
	jwt := GetJwtInstanceByReq(c)
	user := GetUserByJwt(jwt)

	return user
}
