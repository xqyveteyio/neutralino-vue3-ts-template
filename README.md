# fedora 运行
WEBKIT_DISABLE_COMPOSITING_MODE=1 GDK_BACKEND=x11 neu run

WEBKIT_DISABLE_COMPOSITING_MODE=1 GDK_BACKEND=x11 ./dist/wallpaper-manager/wallpaper-manager-linux_x64


# 编译
neu build --embed-resources


# 优化了fedora上的兼容性问题
