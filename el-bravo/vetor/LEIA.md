# El Bravo: cabeça do mascote em vetor (Face 01)

Código e arquivos do redesenho da cabeça (25/11/2026). O passo a passo fica na `main`, em `projetos/el-bravo/PASSO-A-PASSO.md`.

Ordem para refazer (rodar dentro desta pasta; precisa de numpy, scipy, scikit-image, Pillow, vtracer e rsvg-convert):

```bash
python3 seg.py        # silhueta da cabeça -> head_mask.npy
python3 classify.py   # cores do logo -> cls_raw.npy
python3 flat.py       # molduras, olhos, nariz, boca, costuras -> parts.npz
python3 refine.py     # limpeza + imagem chapada com contornos -> flat_label.png
python3 -c "import vtracer; vtracer.convert_image_to_svg_py('flat_label.png','cabeca_trace.svg',colormode='color',hierarchical='stacked',mode='spline',filter_speckle=10,color_precision=8,layer_difference=6,corner_threshold=70,length_threshold=5.0,max_iterations=10,splice_threshold=45,path_precision=2)"
```

`flat_band.py` guarda o traçado medido da faixa dourada da boca. `refs/head_x4.png` é a cabeça do logo atual ampliada 4x (base de todas as medidas).
