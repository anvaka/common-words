-- WARNING: THIS SCRIPT IS DATA INTENSIVE. IT CAN SIGNIFICANTLY CONTRIBUTE
-- TO YOUR FREE QUOTA USAGE. READ BELOW.
--
-- This script will fetch the entire 1.9TB of github content and group it into
-- table:
--
-- lines | extension | num_lines
--
-- where
--  * lines - actual line of code (appears in the original file with \n or \r at the end of the string
--  * extension - file extension where this line appeared
--  * num_lines - how many times this line was seen in the corpus
--
-- To avoid excessive data cost:
--  - each line is trimmed (spacebar and tabs are removed from the beginning and
--    the end of the line).
--  - The lines longer than 119 characters are ignored.
--  - The lines that appear less than 11 times in the corpus are ignored.
--
-- Even with these restrictions the script will process 1.9TB of data, and final
-- result will be ~12GB.
--
-- Make sure you run this script with `allow large results: true` and Query Priority: batch
SELECT
  lines,
  extension,
  COUNT(*) AS num_lines
FROM (
    SELECT
      RTRIM(LTRIM(line, ' \t'), ' \t') lines,
      extension
    FROM (
      SELECT
        SPLIT(SPLIT(content, '\r'), '\n') line,
        extension
      FROM ( -- This will select all lines from all source codes, and will print their extension too
          -- we limit this only to files with extension
        SELECT
          c.id,
          FIRST(c.content) content,
          FIRST(f.extension) extension,
        FROM
          [bigquery-public-data:github_repos.contents] c
        JOIN ( -- extract files extensions and their ids
          SELECT
            REGEXP_EXTRACT(path, r'.+\.(.*?)$') AS extension,
            id
          FROM
            [bigquery-public-data:github_repos.files]
          HAVING
            extension IS NOT NULL ) f
        ON
          f.id = c.id
        WHERE
          c.binary IS FALSE
        GROUP BY
          1 ) ) )
WHERE
  lines != '' and
  LENGTH(lines) < 120  -- don't include long lines... TODO: Does this skew the results?
GROUP EACH BY
  lines,
  extension
HAVING
  num_lines > 10
