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
data set on BigQuery. A word is extracted along with top 10 lines of code where
this word has appeared.

I apply several constraints before saving individual words:

* The line where this word appears should be smaller than 120 characters. This helps
me filter out generated code (like minified JavaScript)
* I ignore punctuation (`, ; : .`), operators (`+ - * ...`) and `numbers`. So if line is
`a+b + 42`, then only two words are extracted: `a` and `b`.
* I ignore lines with "license markers" - words that predominantly appear inside license text
(e.g. `license`, `noninfringement`, etc.). License text is very common in code.
In Java out of 966 most popular words 127 were in license text. It was interesting
to see at the beginning, but overwhelming at the end, so I filtered them out. [Lines with these words are ignored](https://github.com/anvaka/common-words/blob/master/data-extract/ignore/index.js).
* Words are case sensitive: `This` and `this` will be counted as two separate words.

## How the data is collected?

The data comes from GitHub's public data set, indexed by BigQuery: [github_repos](https://bigquery.cloud.google.com/dataset/bigquery-public-data:github_repos)

BigQuery stores contents of each indexed file in a table, as a plain text:

| File Id   | Content                                       |
| ----------|:---------------------------------------------:|
| File 1.h  | // File 1 content\n#ifndef FOO\n#define FOO...|
| File 2.h  | // File 2 content\n#ifndef BAR\n#define BAR...|

To build a word cloud you have to assign `weight` to each word and scale words accordingly.

To assign scale to each word we could split text content into individual words,
and then just group table by each word:

| Word    | Count|
|---------|:----:|
| File    | 2    |
| content | 2    |
| ...     | ...  |

Unfortunately this naive approach does exactly what people don't like about word
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

**NOTE 1:** My SQL-fu is at its toddlerhood, please let me know if you find error or
more appropriate way to get the data. While current script is working, I realize that
there may be cases where results are slightly skewed.

**Note 2:** [BigQuery](https://bigquery.cloud.google.com/) is amazing. It is powerful, flexible and fast. Huge kudos
to amazing people who work on it.

## How word clouds are rendered?
TODO

## How website is created?
TODO

# Tidbits

**TODO describe interesting finding**

# Tools

* https://github.com/anvaka/query-state
* https://github.com/anvaka/rafor
* https://github.com/anvaka/simplesvg

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
