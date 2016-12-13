SELECT
  word,
  SUM(num_lines) AS num_words
FROM
  FLATTEN((
    SELECT
      SPLIT(REGEXP_REPLACE(lines, r'[,;\t#%$+&\-!*/\}\{\(\)\[\]<>|@:\n"\'.=]', ' '), ' ') word,
      num_lines
    FROM
      [yasivcom:github_watch.top_js_lines]), word )
WHERE
  word IS NOT NULL
GROUP EACH BY
  word
ORDER BY
  num_words DESC
LIMIT
  1000
