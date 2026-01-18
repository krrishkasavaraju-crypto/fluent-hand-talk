# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Google Gemini API (for meeting transcript processing)
- ElevenLabs API (optional, for text-to-speech)

## ASL Meeting Companion Setup

This project includes an ASL-first live meeting companion that converts spoken meetings into ASL-friendly visual explanations.

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Required: Google Gemini API Key
# Get your API key from: https://makersuite.google.com/app/apikey
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: ElevenLabs API Key
# Get your API key from: https://elevenlabs.io/
# Used for text-to-speech when Deaf users send messages to hearing participants
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

### Features

- **Two-panel layout**: Simplified text explanations (left) and ASL video placeholders (right)
- **Timeline visualization**: Shows topic progression at the bottom
- **Intent classification**: Automatically categorizes content (instruction, decision, question, discussion, action item)
- **ASL intent buttons**: Quick actions for "Repeat", "Slow down", and "Clarify"
- **Optional ElevenLabs integration**: Allows Deaf users to voice messages to hearing participants

### Important Notes

- This is a **prototype** and NOT an interpreter replacement
- ASL videos shown are **conceptual explanations**, not word-for-word translations
- The system does **NOT** implement sign language recognition
- This is designed as a **visual language layer** for meetings, not a translation engine

### Usage

1. Navigate to `/meeting` or click "Meeting Companion" in the header
2. Paste a meeting transcript or enter live captions
3. Click "Process" to analyze the transcript
4. The system will segment the content into meaningful ideas and display ASL-friendly explanations

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
