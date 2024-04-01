---
title: "Accurate and efficient channel pruning via orthogonal matching pursuit @AIMLSystems 2022"
event: AIMLSystems Conference
event_url: https://www.aimlsystems.org/2022/


# summary: ""
abstract: "The deeper and wider architectures of recent convolutional neural networks (CNN) are responsible for superior performance in computer vision tasks. However, they also come with an enormous model size and heavy computational cost. Filter pruning (FP) is one of the methods applied to CNNs for compression and acceleration. Various techniques have been recently proposed for filter pruning. We address the limitation of the existing state-of-the-art method and motivate our setup. We develop a novel method for filter selection using sparse approximation of filter weights. We propose an orthogonal matching pursuit (OMP) based algorithm for filter pruning (called FP-OMP). We also propose FP-OMP Search, which address the problem of removal of uniform number of filters from all the layers of a network. FP-OMP Search performs a search over all the layers with a given batch size of filter removal. We evaluate both FP-OMP and FP-OMP Search on benchmark datasets using standard ResNet architectures. Experimental results indicate that FP-OMP Search consistently outperforms the baseline method (LRF) by nearly 0.5 − 3%. We demonstrate both empirically and visually, that FP-OMP Search prunes different number of filters from different layers. Further, timing profile experiments show that FP-OMP improves over the running time of LRF."


# Talk start and end times.
#   End time can optionally be hidden by prefixing the line with `#`.
date: 2022-10-14


# Schedule page publish date (NOT talk date).
# <!-- publishDate: 2021-02-11T08:15:38+05:30 -->

authors: ['Kiran Purohit']
# tags: []

# Is this a featured talk? (true/false)
# featured: true
# selected: true

image:
  caption: ''
  focal_point: Smart

links:
url_code: ""
url_pdf: "https://dl.acm.org/doi/pdf/10.1145/3564121.3564139"
url_slides: "AIML_research_presentation_slides.pdf"
url_video: "https://www.youtube.com/watch?v=0eGsSglQIrI&t=782s"



slides: ""



# Enable math on this page?
math: true
---


