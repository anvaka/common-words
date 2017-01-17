# Common words

This visualization shows which words are most often used in different programming
languages.

The index was build between mid/end of 2016 from `~3 million` public open source
GitHub repositories. Results are presented as word clouds and text:

![demo](https://raw.githubusercontent.com/anvaka/common-words/master/docs/main_screen.png)

Below is description of hows and whys. If you want to explore visualizations -
please click here: [common words](https://anvaka.github.io/common-words/#?lang=js). I'll be waiting for you here :).

# How?

I extracted individual words from the [github_repos](https://bigquery.cloud.google.com/dataset/bigquery-public-data:github_repos)
data set on the BigQuery. A word is extracted along with top 10 lines of code where
this word has appeared.

I apply several constraints before saving individual words:

* The line where this word appears should be shorter than 120 characters. This helps
me filter out generated code (like minified JavaScript)
* I ignore punctuation (`, ; : .`), operators (`+ - * ...`) and `numbers`. So if line is
`a+b + 42`, then only two words are extracted: `a` and `b`.
* I ignore lines with "license markers" - words that predominantly appear inside license text
(e.g. `license`, `noninfringement`, etc.). License text is very common in code.
In Java out of 966 most popular words 127 were in license text. It was interesting
to see at the beginning, but overwhelming at the end, so I filtered them out. [Lines with these words are ignored](https://github.com/anvaka/common-words/blob/master/data-extract/ignore/index.js).
* Words are case sensitive: `This` and `this` will be counted as two separate words.

## How the data is collected?

>In this section we take deeper look into words extraction. If you are not interested [jump to word clouds algorithm](#how-word-clouds-are-rendered).

Data comes from the GitHub's public data set, indexed by the BigQuery: [github_repos](https://bigquery.cloud.google.com/dataset/bigquery-public-data:github_repos)

The BigQuery stores contents of each indexed file in a table, as a plain text:

| File Id   | Content                                       |
| ----------|:---------------------------------------------:|
| File 1.h  | // File 1 content\n#ifndef FOO\n#define FOO...|
| File 2.h  | // File 2 content\n#ifndef BAR\n#define BAR...|

To build a word cloud we need a `weight` to scale each word accordingly.

To get the weight we could split text into individual words, and then group table by each word:

| Word    | Count|
|---------|:----:|
| File    | 2    |
| content | 2    |
| ...     | ...  |

Unfortunately, this naive approach does exactly what people don't like about word
clouds - each word will be taken out of context.

I wanted to avoid this problem, and allow people to explore each word along with
their contexts:

![context demo](https://raw.githubusercontent.com/anvaka/common-words/master/docs/context_demo.gif)

To achieve this, I created a temporary table ([code](https://github.com/anvaka/common-words/blob/master/data-extract/sql/get_all_top_lines.sql)),
that instead of counting individual words counts lines:

| Line              | Count |
|-------------------|:-----:|
| // File 1 content |  1    |
| #ifndef FOO       |  1    |
| #define FOO       |  1    |
| ...               | ...   |

This gave me "contexts" for each word and reduced overall data size from couple terabytes
to `~12GB`.

To get top words from this table we can employ previous technique - split line content
into individual words, and then group table by each word. We can also get words
context if we keep original line in intermediate table:


| Line              | Word     |
|-------------------|:--------:|
| // File 1 content | File     |
| // File 1 content | Content  |
| #ifndef FOO       | ifndef   |
| #ifndef FOO       | FOO      |
| ...               | ...      |

From this intermediate representation we can use SQL window function to group by word
and get top 10 lines for each word (more info here: [Select top 10 records for each category](http://stackoverflow.com/questions/176964/select-top-10-records-for-each-category))

Current extraction code can be found here: [extract_words.sql](https://github.com/anvaka/common-words/blob/master/data-extract/sql/extract_words.sql)

**NOTE 1:** My SQL-fu is at its toddlerhood. Please let me know if you find an error or
maybe more appropriate way to get the data. While current script is working, I realize that
there may be cases where results are slightly skewed.

**Note 2:** [BigQuery](https://bigquery.cloud.google.com/) is amazing. It is powerful, flexible and fast. Huge kudos
to amazing people who work on it.

## How word clouds are rendered?

At heart of word clouds lies very simple algorithm:

```
for each word `w`:
  repeat:
    place word `w` at random point (x, y)
  until `w` does not intersect any other word
```

To prevent inner loop from running indefinitely we can try only limited number of
times and/or reduce word's font size if it doesn't fit.

If we step back a little bit from the words, we can formulate this problem in terms
of rectangles: For each rectangle try to place it onto a canvas, until it doesn't
intersect any other pixel.

Obviously, when canvas is heavily occupied finding a spot for a new rectangle can
become challenging or not even possible.

Various authors tried to speed up this algorithm by indexing occupied space:

* Use [summed area table](https://en.wikipedia.org/wiki/Summed_area_table) to quickly,
in O(1) time, tell if a new candidate rectangle intersects anything
beneath it. The downside of this method is that each update requires to update the
entire table, which gives O(N^2) performance;
* Maintain some sort of `R-tree` to quickly tell if a new candidate rectangle intersects anything
beneath it. Intersection lookup in this approach is slower than summed are tables,
but index maintenance is faster.

I think the main downside of both of these methods is that we still can get wrong
initial point many number of times before we find a spot that fits new rectangle.

I wanted to try something different. I wanted to build an index that would let me
quickly pick a rectangle large enough to fit my new incoming rectangles.
I wanted to index my free space, not occupied space.

I choose a [quadtree](https://en.wikipedia.org/wiki/Quadtree) to be my index.
Each non-leaf node in the tree contains information about how many free pixels
are available underneath. At the very basic level this can immediately answer
question: "Is there enough space to fit `M` pixels?". If quad has less available
pixels than `M`, then there is no point in looking inside.

Take a look at this quad tree for JavaScript logo:

![javascript quadtree](https://raw.githubusercontent.com/anvaka/common-words/master/docs/js-quad-tree.png)

White large empty rectangles are quads with available space. If our candidate rectangle
is smaller than any of these quads we could immediately place words in there.

Naive approach with quadtree index gives decent results, however it is
also susceptible to visual artifacts. You can see quadrants borders - no text can
be placed on the intersection of quads:

![quad tree artifacts](https://raw.githubusercontent.com/anvaka/common-words/master/docs/quad-tree-split.gif)

`Largest quad` approach can also miss opportunities. What if there is no single
quad large enough to fit a new rectangle, but, if united with neighbouring quads
a fit can be found?

Indeed, uniting quads helps find spots for new words, as well as removes visual
artifacts. Many quads are united, and the text is very likely to appear on intersection
of two quads:

![quad tree no artifacts](https://raw.githubusercontent.com/anvaka/common-words/master/docs/quad-tree-no-artifact.gif)

> My final code for quadtree word cloud generation is not released. I don't think
> it is ready to be a reusable component, and I have doubts 

## How website is created?

Overall I was [happy](https://twitter.com/anvaka/status/801869174502879232) with achieved
speed of word cloud generation. Yet, it was still too slow for `common-words` website.

I'm using SVG to render each word on a screen. Rendering of 1,000 svg text elements
can easily halt the rendering thread for a couple seconds. There was just not enough
CPU time to squeeze in text layout computation. But the good news - we don't have to.

Instead of computing layout of words over and over again every time why you open
a page, I decided compute layout once, and store results into JSON file.

# Tidbits

**TODO describe interesting finding**

# Tools

* https://github.com/anvaka/query-state - allows to store application state in
the query string. Support bidirectional updates: `query strin <-> application state`
* https://github.com/anvaka/rafor - asynchronous iteration over array, without
blocking the UI thread. This module adapts to amaount of work per cycle, so that
there is enough CPU time to keep UI responsive
* https://github.com/anvaka/simplesvg - very simple wrapper on top of SVG DOM
elements, that provides easy manipulation.

# Why word clouds?

Word clouds in general are considered bad for several reasons:

* They take words out of their context. So `good` does not necessary mean something is good (e.g.
when word `not` was dropped from visualization).
* They scale words to fit inside a picture. So the size of a word cannot be trusted;
* They drop some common words (like `a`, `the`, `not`, etc.)

However, I was always fascinated by algorithms that fit words inside give shape to
produce word cloud.

I spent last couple months of my spare time, developing my own word cloud algorithm.
And this website was born.

# Thank you!

Thank you, dear reader, for being curious. I hope you enjoyed this small exploration.
Also special thanks to my co-worker Ryan, who showed me word-clouds in the first
place.
