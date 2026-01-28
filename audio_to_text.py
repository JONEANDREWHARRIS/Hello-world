#!/usr/bin/env python3
"""
Audio to Text Transcription Tool

This script uses OpenAI's Whisper model to transcribe audio/video files to text.
Based on the AudioToText project: https://github.com/Carleslc/AudioToText

Usage:
    python audio_to_text.py <audio_file> [options]

Example:
    python audio_to_text.py "zauey.talks_Original audio.mp4" --model base --output txt
"""

import argparse
import os
import sys
from pathlib import Path


def check_dependencies():
    """Check if required dependencies are installed."""
    missing = []

    try:
        import whisper
    except ImportError:
        missing.append("openai-whisper")

    try:
        import torch
    except ImportError:
        missing.append("torch")

    if missing:
        print("Missing required dependencies:")
        for dep in missing:
            print(f"  - {dep}")
        print("\nInstall them with:")
        print("  pip install -r requirements.txt")
        print("\nOr install individually:")
        print("  pip install openai-whisper torch")
        sys.exit(1)


def get_available_models():
    """Return list of available Whisper models."""
    return [
        "tiny",      # ~39M parameters, fastest
        "base",      # ~74M parameters, fast
        "small",     # ~244M parameters, balanced
        "medium",    # ~769M parameters, good quality
        "large",     # ~1550M parameters, best quality
        "large-v2",  # Latest large model
        "large-v3",  # Newest large model
    ]


def transcribe_audio(audio_path, model_name="base", language=None, task="transcribe",
                     output_formats=None, output_dir=None, verbose=True):
    """
    Transcribe an audio/video file to text using Whisper.

    Args:
        audio_path: Path to the audio/video file
        model_name: Whisper model to use (tiny, base, small, medium, large, large-v2, large-v3)
        language: Source language code (e.g., 'en', 'es'). Auto-detected if None.
        task: 'transcribe' for same-language transcription, 'translate' for English translation
        output_formats: List of output formats (txt, vtt, srt, tsv, json)
        output_dir: Directory to save output files. Defaults to same directory as input.
        verbose: Print progress information

    Returns:
        dict: Transcription result with 'text', 'segments', and 'language' keys
    """
    import whisper
    import torch

    # Validate input file
    audio_path = Path(audio_path)
    if not audio_path.exists():
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    # Set output directory
    if output_dir is None:
        output_dir = audio_path.parent
    else:
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)

    # Default output formats
    if output_formats is None:
        output_formats = ["txt"]

    # Check for GPU availability
    device = "cuda" if torch.cuda.is_available() else "cpu"
    if verbose:
        print(f"Using device: {device}")
        if device == "cuda":
            print(f"GPU: {torch.cuda.get_device_name(0)}")

    # Load model
    if verbose:
        print(f"Loading Whisper model: {model_name}...")
    model = whisper.load_model(model_name, device=device)

    # Transcribe
    if verbose:
        print(f"Transcribing: {audio_path.name}...")

    options = {
        "task": task,
        "verbose": verbose,
    }
    if language:
        options["language"] = language

    result = model.transcribe(str(audio_path), **options)

    # Save outputs
    base_name = audio_path.stem

    for fmt in output_formats:
        output_path = output_dir / f"{base_name}.{fmt}"

        if fmt == "txt":
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(result["text"].strip())

        elif fmt == "vtt":
            write_vtt(result["segments"], output_path)

        elif fmt == "srt":
            write_srt(result["segments"], output_path)

        elif fmt == "tsv":
            write_tsv(result["segments"], output_path)

        elif fmt == "json":
            import json
            with open(output_path, "w", encoding="utf-8") as f:
                json.dump(result, f, ensure_ascii=False, indent=2)

        if verbose:
            print(f"Saved: {output_path}")

    return result


def format_timestamp(seconds, use_comma=False):
    """Convert seconds to timestamp format."""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = seconds % 60

    separator = "," if use_comma else "."
    return f"{hours:02d}:{minutes:02d}:{secs:06.3f}".replace(".", separator)


def write_vtt(segments, output_path):
    """Write segments to WebVTT format."""
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("WEBVTT\n\n")
        for segment in segments:
            start = format_timestamp(segment["start"])
            end = format_timestamp(segment["end"])
            text = segment["text"].strip()
            f.write(f"{start} --> {end}\n{text}\n\n")


def write_srt(segments, output_path):
    """Write segments to SRT subtitle format."""
    with open(output_path, "w", encoding="utf-8") as f:
        for i, segment in enumerate(segments, 1):
            start = format_timestamp(segment["start"], use_comma=True)
            end = format_timestamp(segment["end"], use_comma=True)
            text = segment["text"].strip()
            f.write(f"{i}\n{start} --> {end}\n{text}\n\n")


def write_tsv(segments, output_path):
    """Write segments to TSV format."""
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("start\tend\ttext\n")
        for segment in segments:
            start = int(segment["start"] * 1000)
            end = int(segment["end"] * 1000)
            text = segment["text"].strip().replace("\t", " ")
            f.write(f"{start}\t{end}\t{text}\n")


def main():
    parser = argparse.ArgumentParser(
        description="Transcribe audio/video files to text using OpenAI Whisper",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s audio.mp3
  %(prog)s video.mp4 --model medium --output txt,srt
  %(prog)s podcast.wav --language en --task translate
  %(prog)s "file with spaces.mp4" --model large-v2

Available models (smallest to largest):
  tiny    - Fastest, least accurate (~1GB VRAM)
  base    - Good balance for most uses (~1GB VRAM)
  small   - Better accuracy (~2GB VRAM)
  medium  - High quality (~5GB VRAM)
  large   - Best quality (~10GB VRAM)
  large-v2/v3 - Latest versions

For more information, visit: https://github.com/Carleslc/AudioToText
        """
    )

    parser.add_argument(
        "audio_file",
        help="Path to the audio or video file to transcribe"
    )
    parser.add_argument(
        "--model", "-m",
        default="base",
        choices=get_available_models(),
        help="Whisper model to use (default: base)"
    )
    parser.add_argument(
        "--language", "-l",
        default=None,
        help="Source language code (e.g., 'en', 'es'). Auto-detected if not specified."
    )
    parser.add_argument(
        "--task", "-t",
        default="transcribe",
        choices=["transcribe", "translate"],
        help="'transcribe' for same-language, 'translate' for English translation (default: transcribe)"
    )
    parser.add_argument(
        "--output", "-o",
        default="txt",
        help="Output formats, comma-separated: txt,vtt,srt,tsv,json (default: txt)"
    )
    parser.add_argument(
        "--output-dir", "-d",
        default=None,
        help="Directory to save output files (default: same as input file)"
    )
    parser.add_argument(
        "--quiet", "-q",
        action="store_true",
        help="Suppress progress output"
    )
    parser.add_argument(
        "--list-models",
        action="store_true",
        help="List available Whisper models and exit"
    )

    args = parser.parse_args()

    if args.list_models:
        print("Available Whisper models:")
        for model in get_available_models():
            print(f"  {model}")
        return

    # Check dependencies
    check_dependencies()

    # Parse output formats
    output_formats = [fmt.strip().lower() for fmt in args.output.split(",")]
    valid_formats = {"txt", "vtt", "srt", "tsv", "json"}
    invalid = set(output_formats) - valid_formats
    if invalid:
        print(f"Invalid output format(s): {', '.join(invalid)}")
        print(f"Valid formats: {', '.join(valid_formats)}")
        sys.exit(1)

    # Run transcription
    try:
        result = transcribe_audio(
            audio_path=args.audio_file,
            model_name=args.model,
            language=args.language,
            task=args.task,
            output_formats=output_formats,
            output_dir=args.output_dir,
            verbose=not args.quiet
        )

        if not args.quiet:
            print("\n" + "=" * 50)
            print("TRANSCRIPTION RESULT:")
            print("=" * 50)
            print(result["text"].strip())
            print("=" * 50)
            print(f"Detected language: {result.get('language', 'unknown')}")

    except FileNotFoundError as e:
        print(f"Error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Error during transcription: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
