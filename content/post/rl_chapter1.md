---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "What is Reinforcement Learning?"
subtitle: ""
summary: "he Reinforcement Learning Problem"
authors: []
tags: ["Reinforcement Learning", "Reinforcement Learning-An Introduction" ]
categories: ["Reinforcement Learning-An Introduction"]
date: 2017-11-09T12:47:09+05:30
lastmod: 2017-11-09T12:47:09+05:30
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
Reinforcement Learning refers to a class of problems which involve learning what to do, i.e. how to map situations to actions so as to maximize a numerical signal.In an essential way these are closed-loop problems because the learning system's actions influence its later inputs. Moreover, unlike supervised learning it is not shown exmaples of desired behaviors,but instead it discovers and learns actions which would yield the maximum reward.Reinforcement learning is also different from unsupervised learning,because the goal of a reinforcement learning problem is to maximize a reward signal and not to find a hidden structure from the data as in supervised learning.

One of the challenges exclusive to reinforcement learning problems, is the trade-off between **exploitation** and **exploration**.
To obtain a lot of reward, a reinforcement learning agent must prefer actions that it has tried in the past and found to be effective in producing reward. But to discover such actions it has to explore new actions.In exploring there is always a risk of failing at the task.So neither exploitation nor exploration can be performed exclusively without failing.

## Key Elements
A reinforcement learning system consists of the following main elements:


* **Policy**: A policy defines the learning agent's way of behaving at a given time.Put simply, a policy is a mapping from perceived states of the environment to actions to be taken when in those states.

* **Reward Signal**: A reward signal is a numeric value which the environment sends to the agent at each step.
In reinforcement learning an agent's sole objective is to maximize this reward signal over the long run.Reward signals may be stochastic functions of the state of the environment and the actions taken.
{% highlight note %}
        Note: The processes that generate reward signal must be un-alterable by the agent, 
        otherwise the agent may change the problem altogether in its favour.
{% endhighlight %}
* **Value Function**: The Value function generates the value of a state. Value of a state is the total amount of reward an agent can expect to accumulate over the future , starting from that state.Values are different from rewards in the sense that rewards are generated directly by the environment, but values must be estimated and re-estimated from the sequences of observation an agent makes over its entire lifetime. Actions are chosen that bring about states of highest value.

* **Model** : Here model refers to a model of the environment.This is something that mimics the behavior of the environment.Reinforcement learining methods that use models are called model based methods, as opposed to model-free methods that are explicitly trial and error learners viewed as almost the opposite of planning.


#### Note: This a summarization of Chapter 1 of the book: [Reinforcement Learning: An Introduction](http://incompleteideas.net/sutton/book/bookdraft2017nov5.pdf)
