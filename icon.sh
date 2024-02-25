# required imagemagick

convert assets/icon/favicon.png -resize 16x16 -background none -extent 16x16 assets/icon/favicon-16x16.png
convert assets/icon/favicon.png -resize 32x32 -background none -extent 32x32 assets/icon/favicon-32x32.png
convert assets/icon/favicon.png -resize 180x180 -background none -extent 180x180 assets/icon/apple-touch-icon.png
convert assets/icon/favicon.png assets/icon/favicon.ico