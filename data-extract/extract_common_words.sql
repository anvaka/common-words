-- Search for `change here`
SELECT
  rs.word,
  rs.lines,
  rs.num_lines
FROM (
  SELECT
    word,
    lines,
    num_lines,
    ROW_NUMBER() OVER (PARTITION BY word ORDER BY num_lines DESC) AS rank
  FROM ( -- this selects all words without nulls, and with lines where this word appeared
      -- num_lines shows how many such lines were encountered in the original source content
    SELECT
      word,
      lines,
      num_lines
    FROM ( FLATTEN( (
          SELECT
            SPLIT(REGEXP_REPLACE(lines, r'[,;\t#%$+&^\-`!*/\}\\?\{\(\)\[\]<>|@:"\'.=]', ' '), ' ') word,
            lines,
            num_lines
          FROM
            (SELECT lines, num_lines FROM [yasivcom:github_watch.all_lines_aggregated]
         where extension = 'cpp' -- change here
      )
            ), word) )
    WHERE
      (word IS NOT NULL) and -- ignore empty words
      (NOT REGEXP_MATCH(word, r'^\d+$')) -- ignore numbers only
      ) ) rs
INNER JOIN (
  SELECT
    word,
    SUM(num_lines) AS num_words
  FROM
    FLATTEN((
      SELECT
        SPLIT(REGEXP_REPLACE(lines, r'[,;\t#%$+&^\-`!*/\}\\?\{\(\)\[\]<>|@:"\'.=]', ' '), ' ') word,
        num_lines
      FROM
        (
        SELECT lines, num_lines FROM [yasivcom:github_watch.all_lines_aggregated]
         where extension = 'cpp' -- change here
      )
        ), word )
  WHERE
    word IS NOT NULL
  GROUP EACH BY
    word
  ORDER BY
    num_words DESC
  LIMIT
    1000 ) popular
ON
  rs.word = popular.word
WHERE
  rs.rank <= 10
ORDER BY
  rs.word,
  rs.num_lines DESC
