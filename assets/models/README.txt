AI models hosted with the site, so the tools that use them keep working even if the original download is removed.

- realesr-general-x4v3.onnx (Image Upscaler): Real-ESRGAN General x4v3 by Xintao Wang et al.,
  BSD 3-Clause License, https://github.com/xinntao/Real-ESRGAN. ONNX export with a fixed 128x128 input
  (output 512x512), from huggingface.co/tamnvcc/Real-ESRGAN-General-x4v3_float.
- migan-pipeline-v2.onnx (Magic Eraser): MI-GAN by Picsart AI Research, MIT License,
  https://github.com/Picsart-AI-Research/MI-GAN. Pipeline export that takes the full image and mask (uint8;
  mask 255 = keep, 0 = fill) and returns the full image, from huggingface.co/andraniksargsyan/migan.
