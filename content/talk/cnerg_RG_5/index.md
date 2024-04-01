---
title: "When Not to Trust Language Models: Investigating Effectiveness of 
Parametric and Non-Parametric Memories @CNeRG Reading Group"
event: CNeRG Reading Group 
event_url: 


# summary: ""
abstract: "Despite their impressive performance on diverse tasks, large language models (LMs) still struggle with tasks requiring rich world knowledge, implying the difficulty of encoding a wealth of world knowledge in their parameters. This paper aims to understand LMs’ strengths and limitations in memorizing factual knowledge, by conducting large-scale knowledge probing experiments on two open-domain entity-centric QA datasets: PopQA, our new dataset with 14k questions about long-tail entities, and EntityQuestions, a widely used open-domain QA dataset. We find that LMs struggle with less popular factual knowledge, and that retrieval augmentation helps significantly in these cases. Scaling, on the other hand, mainly improves memorization of popular knowledge, and fails to appreciably improve memorization of factual knowledge in the tail. Based on those findings, we devise a new method for retrieval-augmentation that improves performance and reduces inference costs by only retrieving non-parametric memories when necessary." 


# Talk start and end times.
#   End time can optionally be hidden by prefixing the line with `#`.
date: 2024-01-18


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
url_pdf: "https://aclanthology.org/2023.acl-long.546.pdf"
url_slides: "when_not_to_trust_LM.pdf"
url_video: ""



slides: ""



# Enable math on this page?
math: true
---


