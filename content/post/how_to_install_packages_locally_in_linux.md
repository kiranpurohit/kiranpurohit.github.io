---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "How to Install Packages Locally in Linux"
subtitle: ""
summary: ""
authors: []
tags: ["Linux", "systems", "server accounts", "hacks"]
categories: ["systems"]
date: 2019-09-12T20:41:53+05:30
lastmod: 2019-09-12T20:41:53+05:30
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
## Some Prerequisites

### What is a variable?

A variable is a storage location for a value. Linux has environment variables. It can store strings, numbers , etc. just like the variables in C, C++, python, or any other programming language. It even has a scope, just like the variables in other programming languages! Based on scopes Linux environments variables can be classified into 2 different categories:

1. Local Variables
2. Global Variable


#### Local Variables
Local variables are set by typing  \<variable_name\>= \<variable_value\> (i.e without the export command).
Local variables can only be accessed by the terminal where it is declared and not by any program even if it is run from the terminal itself.

#### Global Variables
Global variables are set by typing export  \<variable_name\>= \<variable_value\>. The export command ensures that the variable be exported to any child process forked from that terminal. In short, it ensure that the variable set is global.


#### Understanding the Difference

There is a simple way to understand the difference between local and global environmnent variables.

Open a terminal
```bash
export global_var="This is a global variable"
local_var = "This is a local variable"
echo $global_var
echo $local_var
```
Now open tmuxa tmux session. Inside the session, type:
```bash
echo $global_var
echo $local_var
```

You would notice that the local variable inside the tmux session contains no value whereas the global variable outputs the value that it has been assigned.
You can see all the variables defined using the command 'env'.
A variable is unset by typing unset \<variable_name\>


#### Some Important Paths in Linux:
In this journey of learning how to install  packages locally in linux, we need to about two very important global environment variables:
1. PATH
2. LD_LIBRARY_PATH

### what is PATH?
PATH is a list of colon separated directories in which the system looks for executable files. When we type a command the system looks for the executable binaries in each of these directories and executes them if found or else returns an error stating 'command not found'. This lookup by the system occurs in a left-to-right fashion. That is,the system first looks for the executable in the left-most directory in the colon separated list and proceeds on to the next if not found.
This sequence of lookup is necessary to understand because if you have two different executable files with the same name but at different locations(obviously!!), say /usr/local/bin/python and ./anaconda/bin/python , and you want to execute the ./anaconda/bin/python ,then you would have to put ./anaconda/bin(absolute location is preferred, this is a relative location) to the left of /usr/bin in the colon separated list of PATH.

### What is LD_LIBRARY_PATH?
Similar to PATH, LD_LIBRARY_PATH stores the  colon separated list of  directories where the system should search for libraries first, before the standard set of directories. Just like PATH, the lookup in the LD_LIBRARY_PATH also occurs in a left-to-right manner.

### Hands On!!!
In this demo we will be installing GNU-aspell locally.

1. Download the package from this [link](https://ftp.gnu.org/gnu/aspell/aspell-0.60.7.tar.gz) and extract it using ``` tar -xf aspell-0.60.7.tar.gz ``` command.
2. Go inside the directory and type ```./configure --help```. This will list the options for changing the default setup locations among other things. Have a look at the options, especially the ```--prefix```, ```--exec-prefix``` , ```--oldincludedir``` and ```--datadir``` options. We will be using these.
3. Now run configure with the options containing the locations you desire. As an example let me share what I have done: ``` ./configure --prefix='/home/anuragroy/local_install_dirs/' --exec-prefix='/home/anuragroy/local_install_dirs/' --oldincludedir='/home/anuragroy/local_install_dirs/include/' --datadir='/home/anuragroy/local_install_dirs/data/aspell/' ```. Here anuragroy is my username and local_install_dirs can be thought of as a substitute for the ```/usr/local``` directory.
4. After the configuration is done type: {%highlight bash %} make; make clean ``` to install the package.
5. What now remains is to set the required environment variables in the **.bashrc** file. I have added the following lines:
```bash
export PATH="/home/anuragroy/local_install_dirs/bin:$PATH"
export LD_LIBRARY_PATH="/home/anuragroy/local_install_dirs/lib:$LD_LIBRARY_PATH"
export C_INCLUDE_PATH="/home/anuragroy/local_install_dirs/include:$C_INCLUDE_PATH"
export CPLUS_INCLUDE_PATH="/home/anuragroy/local_install_dirs/include:$CPLUS_INCLUDE_PATH"
export MANPATH="/home/anuragroy/local_install_dirs/data/aspell/man:$MANPATH"
```
And now aspell is installed!!! :smile:

Note: Python packages relying on local libraries(for example libraries located in ~/local_install_dirs/lib), headers(for example libraries located in ~/local_install_dirs/include) will return a _cannot find.._ error.There is a way around though ---clone the repository of the package and modify the relevant variables accordingly(like **library_dirs** for libraries and **include_dirs** for headers).
<!-- (Not yet Finished!! :P) -->
