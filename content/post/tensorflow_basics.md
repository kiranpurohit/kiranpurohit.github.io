---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "Tensorflow Basics"
subtitle: ""
summary: "Getting Started With Tensorflow"
authors: []
tags: ["Tensorflow", "Python", "Deep learning", "Neural Networks"]
categories: ["Deep Learning"]
date: 2017-07-05T21:25:58+05:30
lastmod: 2017-07-05T21:25:58+05:30
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
# What is Tensorflow?

Tensorflow is an open source software for machine learning developed by Google.Tensorflow, as one can get from its name, mainly handles matrices(or tensors), its mathematical operations and differentiation efficiently.It is just like Theano but with some extra features like  it can be used on distributed systems.


## Installing Tensorflow

Installing tensorflow >= 1.1.0 can be done using python-pip
```bash
pip install --upgrade tensorflow # for the CPU only version
pip install --upgrade tensorflow-gpu # for the GPU version
```

## Key-Components
Tensorflow works by first creating a computational graph resembling the model we wish to run and then executing it.
A program written using tensorflow must consist of the following components:

1. **Variables**: variables in tensorflow are in memory buffers containing tensors,but unlike normal tensors that live only for a single execution of a graph, variables values live as long as the session exists.Variables value cease to exist after the session is closed. Tensorflow has the option of saving variables' value to disk and restoring them for later use.Variables must be initialized before executing a graph for first time.
During training operation variables get updated by default.Tensorflow variables are created using **tf.Variable()**.We can keep a variable unchanged by explicitly setting its trainable parameter to false.
```python
>>> import tensorflow as tf
>>> # Declaring a tensoflow Variable
>>> W = tf.Variable(tf.random_uniform([2,3],stddev=0.5), # same a numpy.random.uniform
name='weight') # name of the variable in the computational graph
>>> # Setting variable b to non -trainable
>>> b = tf.Variable(tf.zeros([1]), # same as numpy.zeros
name='b', trainable=False)
>>> s = tf.Session() # session created
>>> s.run(tf.initialize_all_variables()) # To initialize all the variables present in the current session
>>> s.run(tf.initialize_variables(W)) # To only initialize W and not b
```

1. **Placeholders**: A placeholder can be thought of as a variable to which we can assign data at a later step.It is populated every single time a computational graph is run.A placeholder usually holds the input values to a model.Placeholder is created in tensorflow using **tf.placeholder()**.Values in placeholders are entered using a feed_dict argument.
```python
>>> import tensorflow as tf
>>> # Declaring a tensoflow Variable
>>> W = tf.Variable(tf.random_uniform([2,3],stddev=0.5), # same a numpy.random.uniform
name='weight') # name of the variable in the computational graph
>>> # Setting variable b to non -trainable
>>> b = tf.Variable(tf.zeros([3]), # same as numpy.zeros
name='b', trainable=False)
>>> x = tf.placeholder(tf.float32, name='x', shape=[None, 2]) # defining a placeholder named x
>>> # of type float32 and shape [None ,2] (None, i.e. any number of rows)
>>> y = tf.add(tf.matmul(x,W), b) # operation x.W + b
>>> s = tf.Session() # session created
>>> s.run(tf.initialize_all_variables()) # To initialize all the variables present in the current session
>>> s.run(y,feed_dict={x:[[1., 2.]]} # placeholder x feeded with value
```

1. **Operations**: Operations in tensoflow are functions which applies some transformations to tensors on the computational graph. Like Variables and placeholders tensorflow operations can also be named for easy identification in the computational graph.An operation may consist of multiple kernels, for different types of devices.For example,  an operation may have seperate CPU and GPU kernels so that it can be excuted more efficiently on GPU.In the previous example **tf.matmul()** and **tf.add()** are two operations.As it relevant from the above example , tensorflow operations can be nested.

1. **Sessions**: A tensorflow session is responsible for interacting with the computational graph thus created and make necessary arrangements for execution of the graph.It allocates resources required by the computational graph and holds the values of variables.Tensorflow session object(say sess) is created using the **tf.Session()** class.Finally we can the computational graph or a subpart of it using the **sess.run()** method.All sess.run does is identify all the dependencies that compose the relevant subgraph, ensure that all the placeholder variables in the concerned subgraph are filled using feed_dict,and then start executing the subgraph.
