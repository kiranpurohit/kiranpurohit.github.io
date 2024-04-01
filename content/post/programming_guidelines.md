---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "Programming Guidelines"
subtitle: ""
summary: "How to write good code"
authors: []
tags: ["coding", "C", "techniques"]
categories: ["coding guidelines by NASA programmer"]
date: 2016-09-03T10:04:25+05:30
lastmod: 2016-09-03T10:04:25+05:30
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

In the paper [The Power of Ten-Rules for Developing Safety Critical Code](http://spinroot.com/gerard/pdf/P10.pdf)
the author has stated 10 rules adhering to which will make one a good programmer.

The author chosed C as the language for writing safety critical code because of the extensive tool support for this language including:


- Strong source code analyzers like [valgrind]( http://valgrind.org)

- debuggers like gdb

- stable compilers

- Test support tools


Following are the 10 rules the author wants to emphasize upon:


-  > Rule: Restrict all code to very simple control flow constructs – do not use goto
   > statements, setjmp or longjmp constructs, and direct or indirect recursion.


The author says to restrict all code to very simple control flow constructs because
it enhances code clarity. Now asking not to use recursion might look suprising but
this is also used to improve code clarity.(Remember that every recursive solution has an
equivalent iterative solution.)


-  >  Rule: All loops must have a fixed upper-bound. It must be trivially possible for a
   > checking tool to prove statically that a preset upper-bound on the number of iterations
   > of a loop cannot be exceeded. If the loop-bound cannot be proven statically, the rule
   > is considered violated.

I think this rule does not need any explanations except for the fact that this rule is not applicable to iterations that
are non-terminating(e.g. in a  process scheduler).In those cases we need to statistically prove that no upper-bound exists for such a problem.


-   > Rule: Do not use dynamic memory allocation after initialization.

This rule is given because memory allocators and garbage collectors often have unpredictable behaviour which might cause a coding error.

-    > Rule: No function should be longer than what can be printed on a single sheet of
     > paper in a standard reference format with one line per statement and one line per
     > declaration. Typically, this means no more than about 60 lines of code per function.


This rule is given to ensure modularity and enhance readability. The author states in his rationale
that "excessively long functions are often a sign of poorly structured code."


-    > Rule: The assertion density of the code should average to a minimum of two
     > assertions per function. Assertions are used to check for anomalous conditions that
     > should never happen in real-life executions. Assertions must always be side-effect
     > free and should be defined as Boolean tests. When an assertion fails, an explicit
     > recovery action must be taken, e.g., by returning an error condition to the caller of the
     > function that executes the failing assertion. Any assertion for which a static checking
     > tool can prove that it can never fail or never hold violates this rule. (I.e., it is not
     > possible to satisfy the rule by adding unhelpful “assert(true)” statements.)


This is because assertions make it easier to find bugs in the code.They are also "side effect free"
which means that they can be selectively disabled without changing the behaviour of the code.


-    > Rule: Data objects must be declared at the smallest possible level of scope.

This rule uses the principle of data hiding. Many errors occur in programs because of wrong referencing
of objects in the code. So if we reduce the scope of refer the object we will be able to find mistake in
referencing in a lesser amount of time.


-    > Rule: The return value of non-void functions must be checked by each calling
     > function, and the validity of parameters must be checked inside each function.

According to the author this is one of the most important rule because sometimes return value of a function
helps us to find error in the code.For e.g. lets say we have problem in closing a file in C.We can do two things
here:
      1. The time consuming one - Put various printf and assertion statements trying to find where
         he error is occurring.
      2. The time saving one - Check the return value of the function close() and lookup it's errno.


-    > Rule: The use of the preprocessor must be limited to the inclusion of header files and
     > simple macro definitions. Token pasting, variable argument lists (ellipses), and
     > recursive macro calls are not allowed. All macros must expand into complete
     > syntactic units. The use of conditional compilation directives is often also dubious,
     > but cannot always be avoided. This means that there should rarely be justification for
     > more than one or two conditional compilation directives even in large software
     > development efforts, beyond the standard boilerplate that avoids multiple inclusion of
     > the same header file. Each such use should be flagged by a tool-based checker and
     > justified in the code.

-    >  Rule: The use of pointers should be restricted. Specifically, no more than one level of
     > dereferencing is allowed. Pointer dereference operations may not be hidden in macro
     > definitions or inside typedef declarations. Function pointers are not permitted.

Pointers often make codes hard to analyze especially by static analyzers.As the author says
" Function pointers, can seriously restrict the types of checks that can be performed
by static analyzers and should only be used if there is a strong justification for their use,
and ideally alternate means are provided to assist tool-based checkers determine flow of
control and function call hierarchies".Function pointers make it impossible for a tool to
prove absence of recursion.

-     > Rule: All code must be compiled, from the first day of development, with all
      > compiler warnings enabled at the compiler’s most pedantic setting. All code must
      > compile with these setting without any warnings. All code must be checked daily with
      > at least one, but preferably more than one, state-of-the-art static source code analyzer
      > and should pass the analyses with zero warnings.