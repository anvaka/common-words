SELECT
  lines,
  COUNT(*) AS num_lines
FROM
  FLATTEN( (
      SELECT
        RTRIM(LTRIM(line, ' \n\t'), ' \n\t') lines
      FROM (
        SELECT
          SPLIT(content, '\r') line,
        FROM
          [bigquery-public-data:github_repos.sample_contents]
        WHERE
          REGEXP_MATCH(sample_path, r'\.js$') ) ),
      lines)
where length(lines) < 120  -- don't include long lines... TODO: Does this skew the results?      
GROUP EACH BY
    lines
Having num_lines > 10
ORDER BY
    num_lines DESC
