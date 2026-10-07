# 雨停之前 · Windows 桌面版

双击发布目录中的 `雨停之前_v1.0.0.exe` 即可启动。运行时、23 个章节模块和全部图片已嵌入单个便携 EXE，不需要安装 Node、浏览器或联网加载素材。启动器会临时解包运行时，退出后清理。

系统标题栏、菜单栏和原生边框均已移除。右上角提供最小化、最大化／还原与关闭；顶部菜单之间的空白区域可拖动窗口。F11 切换全屏，Esc 退出全屏；设置中的全屏按钮也可切换。

进度保存在 `%APPDATA%\BeforeTheRain`，不依赖 EXE 文件的位置或文件名。浏览器版与桌面版使用各自的存档空间：先在原版设置中导出故事备份，再在 EXE 的设置中导入，即可迁移已有进度、书签和收藏。

## 重新打包

在 `E:\game\desktop` 运行 `npm ci`，再运行 `npm run build`。依赖版本锁定在 `package-lock.json`。游戏内容从已通过验收的 `release/雨停之前_v1.0.0` 按清单复制并逐个验证 SHA-256，桌面窗口代码仅加入该副本。

若 GitHub 下载不可达，可在 PowerShell 中将 `ELECTRON_BUILDER_BINARIES_MIRROR` 设置为 `https://npmmirror.com/mirrors/electron-builder-binaries/`。运行时配置已指定镜像，下载工具保留校验。

最终构建位于 `release/desktop-build/雨停之前_v1.0.0.exe`。只需分发这个 EXE，旁边的 `win-unpacked` 是构建中间目录。

`node scripts/inspect_desktop_package.cjs` 检查实际 ASAR 的 68 个运行文件与 33 张图片；`node scripts/verify_desktop.cjs` 从隐藏测试配置启动实际桌面程序，验证窗口控制、结局、备份和移动 EXE 后的存档恢复。验收使用独立的 `release/verification/desktop/test-profile`，不读写玩家存档。
