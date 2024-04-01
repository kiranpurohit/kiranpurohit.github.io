---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "How to determine the Endianness of your PC"
subtitle: ""
summary: ""
authors: []
tags: ["networks", "c++"]
categories: ["byte ordering in the network layer"]
date: 2016-08-28T14:54:27+05:30
lastmod: 2016-08-28T14:54:27+05:30
featured: false
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ""
  focal_point: ""
  preview_only: false

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
# projects: []
---

While studying networks I came across two system calls namely
1. ntoh(s/l)
2. hton(s/l)

Both of the above are related to byte ordering done in the network layer

## ntoh(s/l)
It is used by host to convert a packet from network byte order to host byte order.
(s for short and l for long).

## hton(s/l)
It is used by host before sending a packet to the network.
This function converts a packet in host byte order to network byte order.
(s for short and l for long).


I am not writing the example syntaxes of the above functions because you can easilly get them
in the internet.

## What will happen if I do not use the above functions?
Well this depends upon the endianess of  your machine.
If your machine follows Big Endian then you can do away with the functions,
but if your pc follows little endian then you may get erroneous results.
This is because almost all network protocols follow big endian.

## How to check endianness of your pc
- You can either use the following command

```bash
lscpu
```

and check the endianness of your pc

- You can also use the following cpp code to check the endianness of your pc

```c
# include <stdio.h>
int main(void)
{
   unsigned long i = 1;
   int *c = (int*)&i;
   if (c[0]==1)    
       printf("Little endian\n");
   else if(c[1]==1)
       printf("Big endian\n");
   else
    printf("Unknown Endianness\n");

}
```