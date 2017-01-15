# Common words

This visualization shows which words are most often used in different programming
languages.

The index was build between mid/end of 2016 from `~3 million` public open source
licensed repositories on GitHub. Results are presented as word clouds and text:

![demo](https://raw.githubusercontent.com/anvaka/common-words/master/docs/main_screen.png)

Below is description of whys and hows. If you want to explore visualizations -
please click here (TODO: link). I'll be waiting for you here :).

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

# How?

I extracted individual words from the [github_repos](https://bigquery.cloud.google.com/dataset/bigquery-public-data:github_repos)
data set on BigQuery. A word is extracted along with top 10 lines of code where
this word has appeared.

I apply several constraints before saving individual words:

* The line where this word appears should be smaller than 120 characters. This helps
me filter out generated code (like minified JavaScript)
* I ignore punctuation (`, ; : .`) and operators (`+ - * ...`). So if line is
`a+b`, then only two words are extracted: `a` and `b`.
* I ignore lines with "license markers" - words that predominantly appear inside license text
(e.g. `license`, `noninfringement`, etc.). License text is very common in code.
In Java out of 966 most popular words 127 were in license text. It was interesting
to see at the beginning, but overwhelming at the end, so I filtered them out.
* Words are case sensitive: `This` and `this` will be counted as two separate words.

There are several hows that I want to answer here.

## How the data is collected?

The data comes from GitHub's public data set, indexed by BigQuery: [github_repos](https://bigquery.cloud.google.com/dataset/bigquery-public-data:github_repos)

BigQuery stores contents of each indexed file in a table, as a plain text:

| File Id | Content                                       |
| --------|:---------------------------------------------:|
| File 1  | // File 1 content\n#ifndef FOO\n#define FOO...|
| File 2  | // File 2 content\n#ifndef BAR\n#define BAR...|

To build a word cloud you have to assign `weight` to each word and scale words accordingly.

To assign scale to each word we could split text content into individual words,
and then just group table by each word:

| Word    | Count|
|---------|:----:|
| File    | 2    |
| content | 2    |
| ...     | ...  |
| 1       | 1    |
| 2       | 1    |

Unfortunately this naive approach does exactly what people don't like about word
clouds - each word will be taken out of context.

I wanted to avoid this problem, and allow people to explore each word along with
their contexts.


## How word clouds are rendered?
TODO

## How website is created?
TODO

# Tidbits

** TODO describe interesting finding **

# Tools

* https://github.com/anvaka/query-state
* https://github.com/anvaka/rafor
* https://github.com/anvaka/simplesvg

# Thank you!

Thank you, dear reader, for being curious. I hope you enjoyed this small exploration.
Also special thanks to my co-worker Ryan, who showed me word-clouds in the first
place.
