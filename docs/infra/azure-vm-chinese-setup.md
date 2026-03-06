# Azure VM — Chinese LaTeX Support

The CN resume template (`latexTemp/Resume_CN/main.tex`) uses **xeCJK** with Noto Sans CJK fonts and requires **xelatex** instead of pdflatex.

## Required Packages

```bash
# TeX Live Chinese language support + XeTeX engine
sudo apt-get update
sudo apt-get install -y texlive-lang-chinese texlive-xetex

# Noto CJK fonts
sudo apt-get install -y fonts-noto-cjk fonts-noto-cjk-extra

# Rebuild font cache
fc-cache -fv
```

## Compiler

CN templates must be compiled with `xelatex`:

```bash
xelatex -interaction=nonstopmode -output-directory=/tmp main.tex
```

The render service should detect locale from the request (or from the TeX preamble containing `xeCJK`) and switch compiler accordingly.

## Verification

```bash
# Compile a test CN resume
cd /path/to/latexTemp/Resume_CN
xelatex -interaction=nonstopmode main.tex
```

Expected: produces `main.pdf` with correctly rendered Chinese characters using Noto Sans CJK SC.

## Font Fallback

If Noto Sans CJK SC is unavailable, the template falls back to any CJK font detected by fontspec. To check available CJK fonts:

```bash
fc-list :lang=zh family | head -20
```
