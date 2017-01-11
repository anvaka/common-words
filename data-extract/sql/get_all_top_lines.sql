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
  lines, -- actual line of code. Left/right trimmed, Lines longer than 120 characters are ignored
  extension, -- file extension where this line appeared
  COUNT(*) AS num_lines -- how many times this line was seen
FROM (
    SELECT
    -- it's common in programming languages to have whitespaces/tabs at the start/end
    -- of the line. So we trim whitespaces. Note: LTRIM(line, ' \t') will trim both
    -- ` ` and `\t` symbols
      RTRIM(LTRIM(line, ' \t'), ' \t') lines,
      extension
    FROM (
      SELECT
      -- We split each line by \n or \r symbols. If line ends with \r\n it will
      -- result in an empty string, which will be ignored in the outter select.
        SPLIT(SPLIT(content, '\r'), '\n') line,
        extension
      FROM (
        -- This will select all lines from all source codes, and will print their extension too
        -- Files without extensions are ignored.
        SELECT
          c.id,
          -- since we are grouping by `id` the content and extension should be the same.
          -- Just pick first value:
          FIRST(c.content) content,
          FIRST(f.extension) extension,
        FROM
          [bigquery-public-data:github_repos.contents] c
        JOIN (
          -- Join `contents` table with `files` table to get files extensions.
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
          c.binary IS FALSE -- we analyze text only
        GROUP BY
          1 ) ) )
WHERE
  -- not interested in empty line.
  lines != '' and
  -- don't include long lines.The logic behind this is that if we have lines
  -- that are too long, most likely they are not written by humans.
  LENGTH(lines) < 120
GROUP EACH BY
  lines,
  extension
HAVING
--  to reduce size of the final dataset we completely ignore lines, that appear less than 10 time.
-- It shouldn't affect final results, since we have plenty of common lines in 1.9TB of code.
  num_lines > 10
