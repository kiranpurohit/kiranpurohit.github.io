---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "Multi-Armed Bandits"
subtitle: ""
summary: ""
authors: []
tags: ["Reinforcement Learning", "Reinforcement Learning-An Introduction" ]
categories: ["Reinforcement Learning-An Introduction"]
date: 2017-11-09T16:36:20+05:30
lastmod: 2017-11-09T16:36:20+05:30
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
## Introduction

Reinforcement Learning is different from other machine learning in the aspect that it *evaluates* the actions rather than instructing than *instructing* the correct actions.
  1. Purely evaluative feedback indicates how good an action is , but not whether it is best or worst action possible.

  2. Purely instructive feedback indicates the correct action to take independent of the action already taken.

## K-Armed Bandit Problem

The k-armed bandit problem is similar to one-armed bandits, except that it has k levers instead of one. 
Here we are faced repeatedly with a choice among k different levers, or actions. Here the rewards are the payoffs for hitting the jackpot. 

In the problem, each of the k actions has an expected or mean reward given that that action is selected; 
let us call this the value of that action.We denote the action selected on time step t as $A_t$ , 
and the corresponding reward as $R_t$. The value then of an arbitrary action $a$, denoted $q_∗(a)$, is the expected reward given
that a is selected:

$q_∗(a) = E[R_t | A_t = a]$


We denote the estimated value of action $a$ at time $t$ as $Q_t(a) \approx q_*(a)$   .

Actions whose $Q_t$ value is the highest at time $t$, are called,  *greedy* actions.All the other actions at time $t$ are called *non-greedy* actions.Selecting a greedy action is said to be *exploitation* whereas selecting a non-greedy action is said to be *evaluation*.Exploitation is the right thing to do to maximize the expected on the one step, but exploration may produce greater total reward in the long run.

## Action Value Methods

So now we know that the true value of an action is the  mean reward when the action is chosen.There can be many ways of calcuate this, one way can be:

$$Q_t(a) = \frac{\text{sum of rewards when a is taken prior to t}}{\text{number of times a is taken prior to t}} = \frac{\sum_{i=0}^{t-1} R_i \cdot 1_{A_i = a}}{\sum_{i=0}^{t-1} 1_{A_i = a}}$$

where $1_predicate$ denotes the random variable that is $1$ if $predicate$ is true and $0$ if it is not. If the denominator is zero, then we instead denote $Q_t(a)$ as some default value, 
such as $Q_1(a) = 0$ . 
As the denominator goes to infnity, by the law of large numbers, $Q_t(a)$ converges to $q_*(a)$. 
We call this the *sample-average* method for estimating action values because each *estimate* is an average of the *sample* of relevant rewards.

The *greedy* actions selection method (a.k.a exploitation) can be represented as:

$A_t = \underset{x}{\operatorname{argmax}}Q_t(a)$

Where $argmax_a$ denotes the value of $a$ at which the expressio that follows is maximized(with ties broken arbitrarily). 
A simple alternative to this purely greedy approach is a *$\varepsilon-greedy$* approach where with probability $\varepsilon$ , 
select an action from the set of *non-greedy* actions unformly and randomly.

## Incremental Implementation

We would now dive into the implementation of the above formulae to reinforcement learning problems.
Lets concentrate on a single action $a$. Let $R_i$ denote the reward received after the $ith$ selection of this action.Let $Q_n$ denote the estimate of this action after it has been selected *n-1* times. Then we can write:

$$Q_n(a) = \frac{R_1 + R_2 +...+ R_{n-1}}{n-1}$$

Keeping a record of all the rewards will be inefficient in terms of memory, so we would tweak the formula a little bit:
<div>
$$
\begin{align}
Q_{n+1} & = \frac{1}{n}\sum_{i=1}^{n} R_i \\
& = \frac{1}{n}\bigl(R_n + \sum_{i=1}^{n-1} R_i\bigr) \\
& = \frac{1}{n}\bigl(R_n + (n-1)\frac{1}{n-1}\sum_{i=1}^{n-1} R_i\bigr) \\
& = \frac{1}{n}\bigl(R_n + (n-1)Q_n\bigr) \\
& = \frac{1}{n}\bigl(R_n + nQ_n - Q_n\bigr) \\
& = Q_n + \frac{1}{n}[R_n - Q_n]
\end{align}
$$
</div>

## A Simple Bandit Algorithm

<div>
$$ 
\begin{align}
& \text{Initialize, for a } = 1 \text{ to k}: \\
& \quad Q(a) \leftarrow 0 \\
& \quad N(a) \leftarrow 0 \\
& \text{Repeat Forever:} \\
& \quad A \leftarrow \begin{cases} 
                \underset{a}{\operatorname{argmax}}Q(a)  \text{ with probability 1-} \varepsilon \text{ (breaking ties randomly)} \\
                \text{ a random action with probability } \varepsilon \\
                \end{cases} \\
& R \leftarrow bandit(a) \\
& N(A) \leftarrow N(A) + 1 \\
& Q(A) \leftarrow Q(A) + \frac{1}{N(A)}[R - Q(A)]
\end{align}
$$
</div>

The  $\frac{1}{N(A)}$ parameter (a.k.a *StepSize*) changes from time step to time step and can also be written as 
$\alpha_{t}(a)$.

$\alpha_{t}(a)$ is any function that satisfies the following conditions :

$\sum_{t=1}^{\infty}\alpha_{t}(a) = \infty  \text{   and   }  \sum_{t=1}^{\infty} \alpha_{t}^2(a) \lt \infty $


For the time-being let us consider $\alpha_t$ to be a constant (say $\alpha \epsilon (0,1]$ ).
We can also write $Q_{n+1}$ in terms of $Q_1$:
<div>
$$\begin{align}
Q_{n+1} & = Q_n + \alpha [R_n - Q_n] \\
& = \alpha R_n + (1 - \alpha)Q_n \\
& = \alpha R_n + (1 - \alpha)[\alpha R_n + (1 - \alpha)Q_{n-1}] \\
& = \alpha R_n + (1 - \alpha)[\alpha R_n + (1 - \alpha)Q_{n-1}] \\
& = \alpha R_n + (1 - \alpha)\alpha R_{n-1} + (1 - \alpha)^2 Q_{n-1} \\
& = \alpha R_n + (1 - \alpha)\alpha R_{n-1} + (1 - \alpha)^2 \alpha R_{n-2} + \\
& ... + (1 - \alpha)^{n-1}\alpha R_1 + (1 - \alpha)^n Q_1 \\
& = (1 - \alpha)^n Q_1 + \sum_{i=1}^{n} \alpha(1 - \alpha)^{n-i}R_i \\
\end{align}$$ 
</div>
Choosing a positive $Q_1(a)$ value helps the model to explore more and thus learn better in the long run.

## Upper-Confidence-Bound Action Selection Method

$\varepsilon$-greedy action selection method forces the non-greedy actions to be tried, but indiscriminately, with no preference to those that are nearly greedy. It would be better to select among the non-greedy actions according to their potential for actually being optimal, taking into account both how close their estimates are to being maximal and the uncertanities in those estimates.

One effective way of doing this is to select action as:

$A_t = \underset{a}{\operatorname{argmax}}\Bigl[Qt(a) +  \sqrt[\leftroot{-2}\uproot{2}c]{\tfrac{\log t}{N_t(a)}} \Bigr]$

where $\log t$ denotes the natural logarithm of $t$ , $N_t(a)$ denotes the number of times that action $a$ has been selected prior to time $t$ and the number  $ c \gt 0$ controls the degree of exploration. If $N_t(a) = 0$, then $a$ is considered to be a maximizing action.

The idea of this method is that the square-root term is a measure of the uncertainity or variance in the measure of $a$'s value.Each time action $a$ is selected $N_t(a)$ increases by one and the contribution of the square-root term in selecting action $A_t$ is decreased.That means that if $a$ is chosen a lot of times then chances of it being selected depends mostly on $Q_t$, which should be the behaviour of our model, logically.

## Gradient Bandit Algorithms

In this section we consider learning a numerical preference $H_t(a)$ for each action $a$. The larger the preference more often that action is tken, but the preference has no interpretation in terms of reward.Since the relative preference is important we take softmax over all the preferences at time $t$ which we denote as $\pi_{t}(a)$.

$Pr\{A_t=a\} = \frac{\varepsilon^{H_t(a)}}{\sum_{b=1}^{k} \varepsilon^{H_t(b)}} = \pi_{t}(a)$


There is a natural learning algorithm for this setting based on the idea of stochastic gradient ascent.On each step, after selecting the action $A_t$ and receiving the reward $R_t$, the preferences are updated by:

<div>
$$\begin{align}
H_{t+1}(A_t) & = H_t(A_t) + \alpha(R_t - \bar R_t)(1 - \pi_{t}(A_t)),   \text{             and    } \\
H_{t+1}(a)  & = H_t(a) - \alpha(R_t - \bar R_t)(\pi_{t}(a))  \text{   } \forall a \neq A_t \\
\end{align}$$
</div>


where $\alpha \gt 0$ is step-size parameter, and $\bar R_t \in \mathbb R$ is the average of all the rewards up throught and including time $t$, which can be computed incrementally.The $\bar R_t$ serves as the baseline with which the reward is compared. If the reward is higher than the baseline, then the probability of taking $A_t$ in the future is increased, and if the reward is below baseline, then the probability is decreased.The non-selected actions move in the opposite direction.

For the represenation of the Bandit Gradient Algorithm as Stochastic Gradient Ascent please refer section-2.8(page 29) of the [book](http://incompleteideas.net/sutton/book/bookdraft2017nov5.pdf).


#### Note: This a summarization of Chapter 2 of the book: [Reinforcement Learning: An Introduction](http://incompleteideas.net/sutton/book/bookdraft2017nov5.pdf)