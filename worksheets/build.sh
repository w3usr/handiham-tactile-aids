#!/usr/bin/env bash
# Rebuild every worksheet output from its source. Run from anywhere:
#     bash worksheets/build.sh
# Needs: Python with matplotlib and numpy; the system Python with liblouis bindings
# (python3-louis); pandoc; a TeX distribution with latexmk, pdflatex, xelatex, and the exam class.
set -euo pipefail
cd "$(dirname "$0")"

# Figure for the write-in worksheet (actual-size tile profiles)
python make_profiles.py

# Write-in worksheet: student copy and answer key
latexmk -pdf -interaction=nonstopmode -halt-on-error write-in-worksheet.tex
latexmk -pdf -interaction=nonstopmode -halt-on-error -jobname=write-in-worksheet-key \
  -pdflatex='pdflatex %O "\def\withanswers{1}\input{%S}"' write-in-worksheet.tex

# Activity guide: web page, printable PDF, Braille-ready file
pandoc activity-guide.md -s -o activity-guide.html -H guide-style.html
pandoc activity-guide.md -o activity-guide.pdf --pdf-engine=xelatex \
  -V geometry:margin=1in -V fontsize=12pt -V colorlinks=true
/usr/bin/python3 make_brf.py

# LaTeX intermediates stay out of git (see ../.gitignore)
latexmk -c write-in-worksheet.tex
latexmk -c -jobname=write-in-worksheet-key write-in-worksheet.tex
echo "worksheets rebuilt"
