# 고운바탕 (Gowun Batang)

마음 주치의의 편지에 쓰는 본문 세리프.

- 출처: https://noonnu.cc/font_page/733 · https://fonts.google.com/specimen/Gowun+Batang
- 라이선스: SIL Open Font License 1.1 (상업적 이용·임베딩 허용)
- 원본: https://github.com/google/fonts/tree/main/ofl/gowunbatang

CDN 대신 로컬로 두는 이유는 행사장 키오스크가 오프라인일 수 있어서다.
원본 TTF 8.4MB 를 한글·라틴·구두점 영역만 남겨 woff2 로 서브셋했다 (약 450KB).

재생성 방법:

```sh
pyftsubset GowunBatang-Regular.ttf \
  --unicodes="U+0020-007E,U+00A0-00FF,U+2000-206F,U+20A9,U+20AC,U+2190-2193,U+3000-303F,U+3130-318F,U+AC00-D7A3,U+FF01-FF5E" \
  --layout-features='*' --flavor=woff2 \
  --output-file=GowunBatang-Regular.woff2
```
