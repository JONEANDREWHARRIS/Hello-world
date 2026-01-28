# Hello-world

Audio to Text transcription tool using OpenAI's Whisper model.

Based on [AudioToText](https://github.com/Carleslc/AudioToText) by Carleslc.

## Features

- Transcribe audio and video files to text
- Support for 100+ languages with automatic detection
- Translate audio to English
- Multiple output formats: TXT, VTT, SRT, TSV, JSON
- Generate subtitles/captions for videos
- Works with CPU or GPU (CUDA)

## Requirements

- Python 3.8-3.11
- FFmpeg (for audio processing)
- ~1-10GB disk space (depending on model size)

## Installation

1. Install FFmpeg:

   ```bash
   # Ubuntu/Debian
   sudo apt install ffmpeg

   # macOS
   brew install ffmpeg

   # Windows (using chocolatey)
   choco install ffmpeg
   ```

2. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

## Usage

### Basic Transcription

```bash
python audio_to_text.py "zauey.talks_Original audio.mp4"
```

### Specify Model

```bash
# Use a larger model for better accuracy
python audio_to_text.py audio.mp3 --model medium

# Use a smaller model for faster processing
python audio_to_text.py audio.mp3 --model tiny
```

### Generate Subtitles

```bash
# Generate SRT and VTT subtitle files
python audio_to_text.py video.mp4 --output txt,srt,vtt
```

### Translate to English

```bash
# Translate non-English audio to English
python audio_to_text.py spanish_audio.mp3 --task translate
```

### Specify Source Language

```bash
# Explicitly set source language
python audio_to_text.py audio.mp3 --language es
```

## Available Models

| Model     | Parameters | VRAM   | Speed    | Quality      |
|-----------|------------|--------|----------|--------------|
| tiny      | 39M        | ~1GB   | Fastest  | Basic        |
| base      | 74M        | ~1GB   | Fast     | Good         |
| small     | 244M       | ~2GB   | Moderate | Better       |
| medium    | 769M       | ~5GB   | Slow     | High         |
| large     | 1550M      | ~10GB  | Slowest  | Best         |
| large-v2  | 1550M      | ~10GB  | Slowest  | Best         |
| large-v3  | 1550M      | ~10GB  | Slowest  | Best         |

## Command Line Options

```
python audio_to_text.py <audio_file> [options]

Options:
  --model, -m      Whisper model (tiny/base/small/medium/large/large-v2/large-v3)
  --language, -l   Source language code (e.g., 'en', 'es', 'fr')
  --task, -t       'transcribe' or 'translate' (to English)
  --output, -o     Output formats: txt,vtt,srt,tsv,json
  --output-dir, -d Output directory
  --quiet, -q      Suppress progress output
  --list-models    Show available models
```

## Output Formats

- **TXT** - Plain text transcription
- **VTT** - WebVTT subtitles (for web players)
- **SRT** - SubRip subtitles (for VLC, video editors)
- **TSV** - Tab-separated values (for spreadsheets)
- **JSON** - Full transcription data with timestamps

## Example

Transcribe the included sample audio file:

```bash
python audio_to_text.py "zauey.talks_Original audio.mp4" --model base --output txt,srt
```

## Credits

- [OpenAI Whisper](https://github.com/openai/whisper) - Speech recognition model
- [AudioToText](https://github.com/Carleslc/AudioToText) - Original inspiration
