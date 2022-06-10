Contains configuration for the pgadmin tool used locally to view the postgresql data.

The file is on git ignore with this command, as pgadmin changes it when loaded:

```
git update-index --skip-worktree pgadmin4.db
```

See https://stackoverflow.com/questions/4348590/how-can-i-make-git-ignore-future-revisions-to-a-file
