# Generate brand PNG assets for ourchemistry.ai
# Runs on Windows PowerShell using System.Drawing
Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'
$pub = Join-Path (Get-Location) 'public'
if (!(Test-Path $pub)) { New-Item -ItemType Directory -Path $pub | Out-Null }

function New-GradientIcon {
    param([int]$Size, [string]$Out, [bool]$Round = $false)
    $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.Clear([System.Drawing.Color]::Transparent)

    $cNight = [System.Drawing.Color]::FromArgb(4,6,15)
    $cCyan  = [System.Drawing.Color]::FromArgb(94,234,212)
    $cViolet= [System.Drawing.Color]::FromArgb(167,139,250)
    $cRose  = [System.Drawing.Color]::FromArgb(255,143,178)
    $cGold  = [System.Drawing.Color]::FromArgb(255,215,161)

    $pad = [int]($Size * 0.02)
    $rad = [int]($Size * 0.22)
    $rect = New-Object System.Drawing.Rectangle($pad,$pad,($Size-2*$pad),($Size-2*$pad))
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    if ($Round) {
        $path.AddEllipse($rect)
    } else {
        $d = $rad * 2
        $path.AddArc($rect.X,$rect.Y,$d,$d,180,90)
        $path.AddArc($rect.Right-$d,$rect.Y,$d,$d,270,90)
        $path.AddArc($rect.Right-$d,$rect.Bottom-$d,$d,$d,0,90)
        $path.AddArc($rect.X,$rect.Bottom-$d,$d,$d,90,90)
        $path.CloseFigure()
    }
    $bg = New-Object System.Drawing.SolidBrush($cNight)
    $g.FillPath($bg,$path)

    # diagonal gradient border
    $lgb = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $cCyan, $cRose, 45.0)
    $pen = New-Object System.Drawing.Pen($lgb, [Math]::Max(2, [int]($Size*0.03)))
    $g.DrawPath($pen,$path)

    # radial-ish orb via concentric fills
    $orbR = [int]($Size * 0.18)
    $ax = [int]($Size * 0.36); $ay = [int]($Size * 0.38)
    $bx = [int]($Size * 0.62); $by = [int]($Size * 0.60)
    foreach ($c in @($cViolet,$cCyan)) {
        $ob = New-Object System.Drawing.SolidBrush($c)
        $g.FillEllipse($ob, ($ax-$orbR), ($ay-$orbR), ($orbR*2), ($orbR*2))
    }
    $ob2 = New-Object System.Drawing.SolidBrush($cRose)
    $g.FillEllipse($ob2, ($bx-$orbR), ($by-$orbR), ($orbR*2), ($orbR*2))

    # bond line + spark
    $bond = New-Object System.Drawing.Pen($cGold, [Math]::Max(2,[int]($Size*0.035)))
    $bond.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $bond.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawLine($bond, $ax, $ay, $bx, $by)
    $spark = [int]($Size*0.05)
    $mx = [int](($ax+$bx)/2); $my = [int](($ay+$by)/2)
    $sb = New-Object System.Drawing.SolidBrush($cGold)
    $g.FillEllipse($sb, ($mx-$spark), ($my-$spark), ($spark*2), ($spark*2))

    # clip to shape so nothing bleeds outside
    $bmp.SetResolution(96,96)
    $bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
    Write-Host "wrote $Out"
}

function New-OgImage {
    param([string]$Out)
    $w = 1200; $h = 630
    $bmp = New-Object System.Drawing.Bitmap($w,$h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

    $cNight = [System.Drawing.Color]::FromArgb(4,6,15)
    $cCyan  = [System.Drawing.Color]::FromArgb(94,234,212)
    $cViolet= [System.Drawing.Color]::FromArgb(167,139,250)
    $cRose  = [System.Drawing.Color]::FromArgb(255,143,178)
    $cGold  = [System.Drawing.Color]::FromArgb(255,215,161)
    $cInk   = [System.Drawing.Color]::FromArgb(232,238,252)
    $cMuted = [System.Drawing.Color]::FromArgb(143,151,184)

    $bg = New-Object System.Drawing.SolidBrush($cNight)
    $g.FillRectangle($bg,0,0,$w,$h)

    # aurora blobs
    $lgb1 = New-Object System.Drawing.Drawing2D.LinearGradientBrush((New-Object System.Drawing.Point(0,0)),(New-Object System.Drawing.Point($w,$h)),$cCyan,$cRose)
    $dim = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(26,$cViolet))
    $g.FillEllipse($dim, -200, -180, 700, 700)
    $dim2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(24,$cRose))
    $g.FillEllipse($dim2, 700, 200, 700, 700)
    $dim3 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(22,$cCyan))
    $g.FillEllipse($dim3, 350, 350, 600, 600)

    # orb pair + bond
    $ax=300;$ay=315;$bx=560;$by=315;$orbR=52
    $ob1 = New-Object System.Drawing.SolidBrush($cCyan); $g.FillEllipse($ob1,($ax-$orbR),($ay-$orbR),($orbR*2),($orbR*2))
    $ob2 = New-Object System.Drawing.SolidBrush($cRose); $g.FillEllipse($ob2,($bx-$orbR),($by-$orbR),($orbR*2),($orbR*2))
    $bond = New-Object System.Drawing.Pen($cGold, 7)
    $bond.StartCap=[System.Drawing.Drawing2D.LineCap]::Round; $bond.EndCap=[System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawLine($bond,$ax,$ay,$bx,$by)
    $sb = New-Object System.Drawing.SolidBrush($cGold)
    $g.FillEllipse($sb, 420, 303, 24, 24)

    $fTitle = New-Object System.Drawing.Font('Segoe UI', 62, [System.Drawing.FontStyle]::Bold)
    $fSub   = New-Object System.Drawing.Font('Segoe UI', 26)
    $fTag   = New-Object System.Drawing.Font('Segoe UI', 20, [System.Drawing.FontStyle]::Italic)
    $bInk = New-Object System.Drawing.SolidBrush($cInk)
    $bMuted = New-Object System.Drawing.SolidBrush($cMuted)
    $bGold = New-Object System.Drawing.SolidBrush($cGold)

    $g.DrawString('ourchemistry.ai', $fTitle, $bInk, 60, 120)
    $g.DrawString('The Science of Us', $fSub, $bGold, 64, 210)
    $g.DrawString('Voice-first dating & matrimony. No photos - just chemistry.', $fTag, $bMuted, 64, 470)

    # gradient underline
    $lgb2 = New-Object System.Drawing.Drawing2D.LinearGradientBrush((New-Object System.Drawing.Point(64,0)),(New-Object System.Drawing.Point(700,0)),$cCyan,$cRose)
    $pen2 = New-Object System.Drawing.Pen($lgb2, 6)
    $g.DrawLine($pen2, 64, 190, 700, 190)

    $bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
    Write-Host "wrote $Out"
}

New-GradientIcon -Size 32  -Out (Join-Path $pub 'icon-32.png')
New-GradientIcon -Size 192 -Out (Join-Path $pub 'icon-192.png')
New-GradientIcon -Size 180 -Out (Join-Path $pub 'apple-touch-icon.png') -Round $true
New-GradientIcon -Size 512 -Out (Join-Path $pub 'icon-512.png')
New-OgImage -Out (Join-Path $pub 'og.png')
Write-Host "All brand assets generated."
