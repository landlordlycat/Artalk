import { marked as libMarked } from 'marked'
import ArtalkConfig from './artalk-config'
import { CommentData, NotifyData } from './artalk-data'
import { EventPayloadMap, Event, EventScopeType, Handler } from './event'
import { internal as internalLocales, I18n } from '../src/i18n'
import Api from '../src/api'
import User from '../src/lib/user'
import Editor from '../src/editor'
import Comment from '../src/comment'
import ListLite from '../src/list/list-lite'
import SidebarLayer, { SidebarShowPayload } from '../src/layer/sidebar-layer'
import CheckerLauncher, { CheckerCaptchaPayload, CheckerPayload } from '../src/lib/checker'

/**
 * Context 接口
 *
 * (面向接口的编程)
 */
export default interface ContextApi {
  /** Context 唯一标识 */
  cid: number

  /** Artalk 根元素对象 */
  $root: HTMLElement

  /** 配置对象 */
  conf: ArtalkConfig

  /** 用户对象 */
  user: User

  /** marked 依赖对象 */
  markedInstance?: typeof libMarked

  /** marked 内容替换器 */
  markedReplacers: ((raw: string) => string)[]

  /* 设置持有的同事类 (中介者模式) */
  setApi(api: Api): void
  setEditor(editor: Editor): void
  setList(list: ListLite): void
  setSidebarLayer(list: SidebarLayer): void
  setCheckerLauncher(checkerLauncher: CheckerLauncher): void

  /** 获取 API 以供 HTTP 请求 */
  getApi(): Api

  /** 获取评论实例对象列表 */
  getCommentList(): Comment[]

  /** 获取评论数据列表 */
  getCommentDataList(): CommentData[]

  /** 查找评论 */
  findComment(id: number): Comment|undefined

  /** 删除评论 */
  deleteComment(comment: number|Comment): void

  /** 清空评论 */
  clearAllComments(): void

  /** 插入评论 */
  insertComment(commentData: CommentData): void

  /** 评论回复 */
  replyComment(commentData: CommentData, $comment: HTMLElement, scroll?: boolean): void

  /** 取消回复评论 */
  cancelReplyComment(): void

  /** 更新通知数据 */
  updateNotifies(notifies: NotifyData[]): void

  /** 列表 - 重新加载数据 */
  listReload(): void

  /** 列表 - 重新加载数据 (别名) */
  reload(): void

  /** 列表 - UI 更新 */
  listRefreshUI(): void

  /** 显示侧边栏 */
  showSidebar(payload?: SidebarShowPayload): void

  /** 隐藏侧边栏 */
  hideSidebar(): void

  /** 编辑器 - 关闭评论 */
  editorClose(): void

  /** 编辑器 - 打开评论 */
  editorOpen(): void

  /** 编辑器 - 显示加载 */
  editorShowLoading(): void

  /** 编辑器 - 隐藏加载 */
  editorHideLoading(): void

  /** 编辑器 - 显示提示消息 */
  editorShowNotify(msg: string, type: "i" | "s" | "w" | "e"): void

  /** 评论框 - 位置移动 */
  editorTravel($el: HTMLElement): void

  /** 评论框 - 位置回归 */
  editorTravelBack(): void

  /** 验证码检测 */
  checkCaptcha(payload: CheckerCaptchaPayload): void

  /** 管理员检测 */
  checkAdmin(payload: CheckerPayload): void

  /** 管理员显示元素可见性更新 */
  checkAdminShowEl(): void

  /** 订阅注册 */
  on<K extends keyof EventPayloadMap>(name: K, handler: Handler<EventPayloadMap[K]>, scope?: EventScopeType): void

  /** 订阅取消 */
  off<K extends keyof EventPayloadMap>(name: K, handler?: Handler<EventPayloadMap[K]>, scope?: EventScopeType): void

  /** 订阅发布 */
  trigger<K extends keyof EventPayloadMap>(name: K, payload?: EventPayloadMap[K], scope?: EventScopeType): void

  /** i18n 翻译 */
  $t(key: keyof I18n, args?: {[key: string]: string}): string

  /** 设置暗黑模式 */
  setDarkMode(darkMode: boolean): void
}
