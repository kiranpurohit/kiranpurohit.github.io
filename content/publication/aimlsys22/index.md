+++
title = "Accurate and efficient channel pruning via orthogonal matching pursuit"

# Date first published.
date = "2022-09-05"

# Authors. Comma separated list, e.g. `["Bob Smith", "David Jones"]`.
authors = ["Kiran Purohit", "Anurag Parvathgari", "Soumi Das", "Sourangshu Bhattacharya"]

# Publication type.
# Legend:
# 0 = Uncategorized
# 1 = Conference proceedings
# 2 = Journal
# 3 = Work in progress
# 4 = Technical report
# 5 = Book
# 6 = Book chapter
publication_types = ["1"]

# Publication name and optional abbreviated version.
publication = "AI ML Systems 2022"
publication_short = "AIMLSystems 2022"

# Abstract and optional shortened version.
abstract = "The deeper and wider architectures of recent convolutional neural networks (CNN) are responsible for superior performance in computer vision tasks. However, they also come with an enormous model size and heavy computational cost. Filter pruning (FP) is one of the methods applied to CNNs for compression and acceleration. Various techniques have been recently proposed for filter pruning. We address the limitation of the existing state-of-the-art method and motivate our setup. We develop a novel method for filter selection using sparse approximation of filter weights. We propose an orthogonal matching pursuit (OMP) based algorithm for filter pruning (called FP-OMP). We also propose FP-OMP Search, which address the problem of removal of uniform number of filters from all the layers of a network. FP-OMP Search performs a search over all the layers with a given batch size of filter removal. We evaluate both FP-OMP and FP-OMP Search on benchmark datasets using standard ResNet architectures. Experimental results indicate that FP-OMP Search consistently outperforms the baseline method (LRF) by nearly 0.5 − 3%. We demonstrate both empirically and visually, that FP-OMP Search prunes different number of filters from different layers. Further, timing profile experiments show that FP-OMP improves over the running time of LRF." 

# Featured image thumbnail (optional)
image_preview = ""

# Is this a selected publication? (true/false)
selected = true
featured = true
# Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter the filename (excluding '.md') of your project file in `content/project/`.
#   E.g. `projects = ["deep-learning"]` references `content/project/deep-learning.md`.
# projects = ["Hate Speech Detection"]

# Links (optional).
url_pdf = "https://dl.acm.org/doi/pdf/10.1145/3564121.3564139"
# url_preprint = "https://arxiv.org/abs/2012.10289"
# url_code = "https://github.com/CVIR/contracon"
# url_dataset = "https://huggingface.co/datasets/hatexplain"
# url_project = "https://cvir.github.io/projects/contracon"
url_slides = "AIML_research_presentation_slides.pdf"
url_video = "https://www.youtube.com/watch?v=0eGsSglQIrI&t=782s"
url_poster = ""
url_source = ""
doi = "10.1145/3564121.3564139"

# Custom links (optional).
#   Uncomment line below to enable. For multiple links, use the form `[{...}, {...}, {...}]`.
# url_custom = [{name = "Custom Link", url = "http://example.org"}]

# Does the content use math formatting?
math = true

# Does the content use source code highlighting?
highlight = true

# Featured image
# Place your image in the `static/img/` folder and reference its filename below, e.g. `image = "example.jpg"`.
[header]
image = "featured.png"
caption = "Filter Pruning via OMP"




  # Focal point (optional)
  # Options: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight
#  focal_point = "Smart"
+++
