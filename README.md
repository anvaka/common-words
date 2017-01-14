# Common words

This visualization shows which words are most often used in different programming
languages.

The index was build between mid/end of 2016 from `~3 million` public open source
licensed repositories on GitHub. Results are presented as a word cloud
and as a plain list:

[TODO Insert image]

Below is description of whys and hows in much greater details. If you want to
explore visualizations - please click here (TODO: link). I'll be waiting
for you here :).

# Why?

Word clouds in general are considered bad for several reasons (taking words out of
their context, scaling them to fit inside a picture, or dropping words if they don't
fit at all). However, I was always fascinated by word cloud algorithm, that fits
set of words inside given shape.

I spent last couple months of my spare time, developing my own word cloud algorithm.
And this website was born.

# How?

There are several hows that I want to answer here.

## How the data is collected?

The data comes from GitHub's public data set, indexed by BigQuery: [github_repos](https://bigquery.cloud.google.com/dataset/bigquery-public-data:github_repos)

BigQuery stores contents of each indexed file in a table, as a plain text:

| File Id | Content                                       |
| --------|:---------------------------------------------:|
| File 1  | // File 1 content\n#ifndef FOO\n#define FOO...|
| File 2  | // File 2 content\n#ifndef BAR\n#define BAR...|

Normally, to build a word cloud all you have to do, is assign `weight` to each
word and scale words accordingly.

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

# Thank you!

Thank you, dear reader, for being curious. I hope you enjoyed this small exploration.
Also special thanks to my co-worker Ryan, who showed me word-clouds in the first
place.
