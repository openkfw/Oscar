# Contributing to Oscar

Thanks for taking the time to contribute!

The following is a set of guidelines for contributing. These are mostly
guidelines, not rules. Use your best judgment, and feel free to propose changes
to this document in a pull request.

## Table of Contents

- [Contributing to Oscar](#contributing)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [How to get started with Oscar](#how-to-get-started-with-oscar)
  - [How to ask for support](#how-to-ask-for-support)
  - [How to contribute](#how-to-contribute)
    - [Create an issue](#create-an-issue)
    - [Open a Pull Request](#open-a-pull-request)
    - [Don't forget to update the changelog!](#don't-forget-to-update-the-changelog!)
  - [Styleguides](#styleguides)
    - [Git Commits](#git-commits)
    - [Git Branches](#git-branches)
  - [Source Layout](#source-layout)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct]. By
participating, you are expected to uphold this code. Please report unacceptable
behavior to [Ingmar Müller], who is the current project maintainer.

## How to get started with Oscar

If this is your first time starting Oscar, you should follow the [Developer Setup] for setting up the project.

## How to ask for support

If you need to ask for support feel free to reach out to us in
[discussions], check out the existing [documentation] or create a new [github issue]

## How to contribute

### Create an issue

Feel free to help out if you noticed a bug or if you want to suggest a new feature by simply opening a new [github issue]

### Open a Pull Request

When working on a feature, you can open a PR in as soon as you push the first changes. Please make sure you follow these guidelines regarding PRs:

- Make sure that the PR description clearly describes what you are working on
- If aplicable, mention what issue will be closed with this pull request, by typing `Closes #issueNumber`
- Describe how you are planning on implementing the solution, maybe by creating a TODO list
- The PR should be in draft mode if you're still making some changes. If it is ready to be reviewed then mark it as "Ready for review"

### Don't forget to update the changelog!

If you make changes that are relevant to the end user you should add an entry in the CHANGELOG.md file, which can be found in the root folder of the project. Before adding to the changelog, you should read these [guidelines]

## Styleguides

### Git Commits

When writing commits you should consider the following guidelines:

- Follow these [git commit guidelines]
- Always include a prefix in the commit message with '#' and the number of issue, you work on, e.g. '#1-documentation structure'
- When you're only changing the documentation you can include `[ci skip]` in the commit title

### Git Branches

When creating a new branch, you should consider the following guidelines regarding branch names:

- Lead with the number of the issue you are working on
- Add a short description of what the task is about
- Use hyphens as separators

### Git Workflow

When working on a feature branch make sure to:

1. Checkout the master branch and pull the recent changes
2. Create a new feature branch respecting the guidelines mentioned above
3. Try to keep the commits separate and respect the guidelines mentioned above.
4. Push to the remote repository and open a pull request respecting the guidelines mentioned above
5. Make sure the pipelines are passing
6. Wait for a review. If you need a specific team member to review the PR you can request a review from them and assign them to the PR
7. When your feature is ready make sure you have the latest changes from master merged into your feature branch and push the changes
8. Merge the pull request into master

## Source Layout

Best practices and layout is documented in README files next to the source files they
describe. For example, take a look at [api/src/](api/src/) to get started.

[github issue]: https://github.com/openkfw/Oscar/issues
[code of conduct]: https://github.com/openkfw/Oscar/blob/master/CODE_OF_CONDUCT.md
[Ingmar Müller]: https://github.com/IngmarM
[discussions]: https://github.com/openkfw/Oscar/discussions
[developer setup]: https://github.com/openkfw/Oscar/blob/master/doc/getting-started/development.md
[guidelines]: https://keepachangelog.com/en/1.0.0/
[git commit guidelines]: https://chris.beams.io/posts/git-commit/
[open a pull request]: https://github.com/openkfw/TruBudget/pulls
[how to / git]: https://gist.github.com/robertpataki/1b70e22d14ef92e1be1338314809b46e
[documentation]: https://github.com/openkfw/Oscar/tree/master/doc