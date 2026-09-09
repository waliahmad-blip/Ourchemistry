import os
import subprocess
import time
import sys

def build_pdf():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    css_path = os.path.join(base_dir, "blueprint_styles.css")
    pages_dir = os.path.join(base_dir, "pages")
    
    with open(css_path, "r", encoding="utf-8") as f:
        css = f.read()
        
    page_files = [f"page{i}_{name}.html" for i, name in [
        (1, "cover"),
        (2, "vision"),
        (3, "topology"),
        (4, "dsp"),
        (5, "soundscape"),
        (6, "guardrails"),
        (7, "bond"),
        (8, "vanish"),
        (9, "data"),
        (10, "roadmap"),
        (11, "telemetry"),
    ]]
    
    body_content = ""
    for pf in page_files:
        p_path = os.path.join(pages_dir, pf)
        if not os.path.exists(p_path):
            print(f"Error: Missing page file {p_path}")
            sys.exit(1)
        with open(p_path, "r", encoding="utf-8") as f:
            body_content += f.read() + "\n"
            
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>ourchemistry.ai — Sovereign Architectural Blueprint</title>
<style>
{css}
</style>
</head>
<body>
{body_content}
</body>
</html>
"""

    dest_pdf = r"C:\Ourchemistry\PROJECT_BLUEPRINT.pdf"
    tmp_html = os.path.join(base_dir, "temp_blueprint.html")
    
    try:
        with open(tmp_html, "w", encoding="utf-8") as f:
            f.write(html)
            
        edge_executable = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
        if not os.path.exists(edge_executable):
            edge_executable = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
            
        print("Compiling publication-quality PDF via Microsoft Edge Headless...")
        print(f"Source HTML: {tmp_html}")
        print(f"Destination: {dest_pdf}")
        
        # Remove existing destination PDF if present
        if os.path.exists(dest_pdf):
            try:
                os.remove(dest_pdf)
            except Exception as e:
                print(f"Warning: could not remove old PDF: {e}")

        norm_html_url = "file:///" + tmp_html.replace(os.sep, "/")
        
        cmd = [
            edge_executable,
            "--headless=new",
            "--disable-gpu",
            "--no-margins",
            f"--print-to-pdf={dest_pdf}",
            norm_html_url
        ]
        
        proc = subprocess.run(cmd, capture_output=True, text=True)
        if proc.returncode != 0 and proc.stderr:
            print(f"Edge warning: {proc.stderr}")
            
        # Poll for detached Edge worker to complete writing the PDF
        last_size = -1
        stable_count = 0
        timeout_seconds = 20
        start_time = time.time()
        
        while time.time() - start_time < timeout_seconds:
            if os.path.exists(dest_pdf):
                current_size = os.path.getsize(dest_pdf)
                if current_size > 0 and current_size == last_size:
                    stable_count += 1
                    if stable_count >= 2: # Stable across checks
                        break
                elif current_size > 0:
                    stable_count = 0
                    last_size = current_size
            time.sleep(0.5)
            
        if os.path.exists(dest_pdf) and os.path.getsize(dest_pdf) > 0:
            file_size_kb = os.path.getsize(dest_pdf) / 1024
            print(f"SUCCESS: Blueprint PDF generated successfully!")
            print(f"File: {dest_pdf}")
            print(f"Size: {file_size_kb:.2f} KB ({os.path.getsize(dest_pdf):,} bytes)")
        else:
            print("ERROR: PDF was not generated within timeout.")
            sys.exit(1)
            
    finally:
        # Clean up temporary HTML file
        if os.path.exists(tmp_html):
            try:
                os.remove(tmp_html)
                print("Temporary HTML artifact cleaned up.")
            except Exception as e:
                print(f"Notice: Could not remove temporary file {tmp_html}: {e}")

if __name__ == "__main__":
    build_pdf()

