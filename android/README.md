# 雨停之前 · Android 手机版

安装文件：`E:\game\release\雨停之前_v1.0.0.apk`。支持 Android 8.0 及以上，使用手机的 Android System WebView 显示游戏；推荐使用已更新的系统 WebView。全部剧情、立绘、背景与封面内置，离线游玩，通用 APK 无 CPU 架构限制。

支持横屏和竖屏。竖屏中对话与五个常用按钮固定在屏幕下方，多选项区域可上下滑动；横屏时选项与对话并排显示。系统返回键优先关闭弹窗，阅读中打开菜单，标题页退出时弹出确认。全屏可在设置中切换，系统手势可临时唤出导航栏。原生窗口处理刘海、系统栏与底部手势安全区域。

存档保存在应用内部。要迁移电脑版进度，在电脑版设置里导出故事备份，将 JSON 文件复制到手机，再在手机设置中选择“导入备份”。导出时使用 Android 文件选择器指定保存位置。自动存档、快速存档、书签、路线书签与回忆收藏沿用同一备份格式。旋转屏幕保持同一 WebView 与当前进度，切到后台暂停自动阅读与音乐。

## 构建与签名

入口是 `node scripts/build_android.cjs`，使用 JDK、Android SDK 34 与 Build Tools 34.0.0。可通过 `JAVA_HOME`、`ANDROID_SDK_ROOT` 指定本机工具目录。Java 21 需先运行 `node scripts/fetch_android_tools.cjs` 下载并校验官方 R8 编译器，版本与摘要记录在 `.build-cache/android-tools/r8-lock.json`。无需安装 Gradle 或改动电脑版。

`stage_android.cjs` 从已验收的网页版按清单复制素材并校验源文件，再加入手机 CSS、Android 操作适配层和后台生命周期回调。原浏览器版与 EXE 不受这些修改影响。

签名密钥 `android/signing/rain-release.p12` 和密码文件需妥善保留，用于以后覆盖安装更新；不包含在 APK 中，也不应发送给玩家。发布时仅需 APK。普通更新会保留应用数据；卸载或清除应用数据前需自行导出故事备份。

## 验证范围

签名、ZIP 对齐、启动入口和 DEX 编译通过。`inspect_android_apk.cjs` 对实际 APK 的 66 个运行素材逐一比对，确认全部 33 张图片、23 个章节模块和 13 个结局的脚本完整，无测试目录、签名密钥、构建工具或玩家进度混入。

`verify_android_mobile.cjs` 在 Chromium 中模拟触摸手机，验证 8 种屏幕尺寸、多选项滚动、对话与按钮可见、横竖屏切换不变更存档、13 个最终结局、74 张收藏卡、电脑版真实备份导入和无效备份拒绝。原生桥在此测试中使用替身，Android 文件选择器与真实设备兼容性尚未实机验收；本机没有连接 Android 设备或可运行的模拟器。具体记录位于 `release/verification/android`。
