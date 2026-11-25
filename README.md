# CIN & LLPIN Checker

Paste any number of Corporate Identification Numbers (CIN) and Limited
Liability Partnership Identification Numbers (LLPIN). The app checks the
format of each one and reads out what the number says about the entity.

## Features

- Bulk input: check many identifiers at once
- Format validation for CINs and LLPINs
- Plain-language breakdown of each identifier
- Responsive UI built with Tailwind CSS

## Tech Stack

- Next.js
- React
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm, yarn, or pnpm

### Installation

```bash
git clone https://github.com/MayankArya123/cin-llpin-verification-tool.git
cd  filesure-cin-checker
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

## Scripts

| Command                | Description                    |
| ---------------------- | ------------------------------ |
| `npm run dev`          | Start the development server   |
| `npm run build`        | Create a production build      |
| `npm start`            | Run the production build       |
| `npm run format`       | Format all files with Prettier |
| `npm run format:check` | Check formatting without edits |

## Usage

1. Paste one or more CINs or LLPINs, one per line.
2. Click **Check identifiers**.
3. Review the format check and the decoded details for each entry.

## Project Structure

```
src/
  app/          # Pages and layouts
  lib/          # Validation and parsing logic
```

## Disclaimer

This tool checks identifier format and decodes the information embedded in
the number. It does not confirm that a company or LLP is currently registered
or in good standing. Verify against official MCA records.
