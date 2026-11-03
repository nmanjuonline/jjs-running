param(
    [string]$Repo = "nmanjuonline/jjs-running",
    [string]$Token = $env:GITHUB_TOKEN
)

if (-not $Token) {
    Write-Host "Please provide a GitHub Personal Access Token:" -ForegroundColor Yellow
    $Token = Read-Host "Enter token"
    if (-not $Token) {
        Write-Error "A GitHub token is required to create issues."
        exit 1
    }
}

$headers = @{
    "Authorization"        = "Bearer $Token"
    "Accept"               = "application/vnd.github+json"
    "User-Agent"           = "JJs-Running-Script"
    "X-GitHub-Api-Version" = "2022-11-28"
}

$issues = @(
    @{
        title = "[Copy Review]: Hero & Flagship Programs (#1 - #6)"
        body = @'
## Overview
Baseline grammar, phrasing, and natural language corrections for the **Hero** and **Flagship Programs** sections.

### Tasks
- [ ] **#1 - Hero**:
  - **Current**: *"Structured heart-rate zone training, cadence calibration, and injury-free marathon milestones led by certified Training Center Heads (TCH)."*
  - **Recommended**: *"Structured heart-rate zone training, cadence calibration, and injury-free marathon preparation, led by certified Training Center Heads (TCH)."*
  - **Reason**: "Marathon milestones led by..." is awkward. "Marathon preparation" creates a clearer relationship.
- [ ] **#2 - Flagship Programs**:
  - **Current**: *"Progressive weekly mileage, structured tempo splits, and weekend long-run pacing - tailored for first-time 5K runners to seasoned marathoners."*
  - **Recommended**: *"Progressive weekly mileage, structured tempo splits, and weekend long-run pacing - tailored for everyone from first-time 5K runners to seasoned marathoners."*
  - **Reason**: "For X to Y" is incomplete; "for everyone from X to Y" is natural English.
- [ ] **#3 - Fitness Thru Running**:
  - **Current**: *"...biomechanics analysis..."*
  - **Recommended**: *"...biomechanical analysis..."*
  - **Reason**: More natural adjective-noun construction.
- [ ] **#4 - 10K Program**:
  - **Current**: *"Take your 10K pace to the next tier..."*
  - **Recommended**: *"Take your 10K performance to the next level..."*
  - **Reason**: "Pace to the next tier" sounds unnatural.
- [ ] **#5 - Half Marathon**:
  - **Current**: *"Our celebrated \"Reach Your Full Potential\" half marathon curriculum. Systematic weekend Slow..."*
  - **Recommended**: *"Our celebrated \"Reach Your Full Potential\" half-marathon program features systematic weekend slow long runs..."*
  - **Reason**: Current construction becomes a sentence fragment.
- [ ] **#6 - Half Marathon**:
  - **Current**: *"Progressive mileage buildup up to 18-20 km"*
  - **Recommended**: *"Progressive mileage build-up to 18-20 km"*
  - **Reason**: Removes repetitive "buildup up to."
'@
    },
    @{
        title = "[Copy Review]: Science of Endurance, Aerobic Base & Biomechanics (#7 - #12)"
        body = @'
## Overview
Baseline grammar, terminology, and tone corrections for the **Science of Endurance**, **Zone 2 Aerobic Base**, **Strength & Core**, and **Cadence & Biomechanics** sections.

### Tasks
- [ ] **#7 - Science of Endurance**:
  - **Current**: *"...transforming zero-running beginners into confident marathon finishers..."*
  - **Recommended**: *"...transforming complete beginners into confident marathon finishers..."*
  - **Reason**: "Zero-running beginners" is not natural English.
- [ ] **#8 - Zone 2 Aerobic Base**:
  - **Current**: *"...triggers mitochondrial biogenesis and fat-oxidation efficiency..."*
  - **Recommended**: *"...designed to promote mitochondrial development and improve fat-oxidation efficiency..."*
  - **Reason**: "Triggers efficiency" is awkward wording.
- [ ] **#9 - Strength, Core & Mobility**:
  - **Current**: *"...dynamic warmups, and dedicated post-run stretch circuits."*
  - **Recommended**: *"...dynamic warm-ups, and dedicated post-run stretching circuits."*
  - **Reason**: Improves grammar and consistency.
- [ ] **#10 - Strength, Core & Mobility**:
  - **Current**: *"98.4% injury-free Longevity"*
  - **Recommended**: *"98.4% Injury-Free Completion Rate"*
  - **Reason**: "Longevity" does not fit naturally with this metric; site already uses "injury-free completion rate."
- [ ] **#11 - Cadence & Biomechanics**:
  - **Current**: *"...forward lean from ankles..."*
  - **Recommended**: *"...a forward lean from the ankles..."*
  - **Reason**: Missing articles.
- [ ] **#12 - Cadence & Biomechanics**:
  - **Current**: *"...to eliminate heel-strike jarring."*
  - **Recommended**: *"...to reduce the impact associated with heel striking."*
  - **Reason**: More natural wording and avoids an absolute "eliminate" claim.
'@
    },
    @{
        title = "[Copy Review]: Training Protocol, Jaguar Culture & Social (#13 - #18)"
        body = @'
## Overview
Grammar, sentence completion, and stylistic fixes for **Training Protocol**, **Jaguar Spirit & Culture**, **Post-Run Chai**, and **Major Race Charters**.

### Tasks
- [ ] **#13 - Training Protocol**:
  - **Current**: *"Led across 20+ neighborhood grounds by designated Training Center Heads (TCH)."*
  - **Recommended**: *"Training sessions are led across 20+ neighborhood grounds by designated Training Center Heads (TCHs)."*
  - **Reason**: Current text is a sentence fragment; plural acronym is appropriate.
- [ ] **#14 - Training Protocol**:
  - **Current**: *"Sessions kick off at 05:30 AM sharp."*
  - **Recommended**: *"Sessions begin at 5:30 AM sharp."*
  - **Reason**: Cleaner, more professional wording and standard time format.
- [ ] **#15 - Jaguar Spirit & Culture**:
  - **Current**: *"From college students to runners in their 70s and 80s, software engineers, doctors, teachers, entrepreneurs, and homemakers."*
  - **Recommended**: *"Our community includes everyone from college students to runners in their 70s and 80s, as well as software engineers, doctors, teachers, entrepreneurs, and homemakers."*
  - **Reason**: Current text is a sentence fragment.
- [ ] **#16 - Jaguar Spirit & Culture**:
  - **Current**: *"Whether your pace is 4:15/km or 9:30/km..."*
  - **Recommended**: *"Whether your pace is 4:15 min/km or 9:30 min/km..."*
  - **Reason**: Makes pace units explicit and consistent.
- [ ] **#17 - Post-Run Chai**:
  - **Current**: *"The signature Sunday morning recovery run, stretching circle, and filter coffee."*
  - **Recommended**: *"Enjoy our signature Sunday morning recovery run, stretching circle, and filter coffee."*
  - **Reason**: Current copy is a fragment; adds an active verb.
- [ ] **#18 - Major Race Charters**:
  - **Current**: *"Travel charters, hospitality tents & cheer zones for TMM, TCS 10K & World Majors."*
  - **Recommended**: *"Travel charters, hospitality tents, and cheer zones for TMM, TCS 10K, and the World Marathon Majors."*
  - **Reason**: Standardizes "and" in body copy and improves phrasing.
'@
    },
    @{
        title = "[Copy Review]: Training Centers & Ground Details (#19 - #20)"
        body = @'
## Overview
Clean-up of center selection instructions and ground session schedule format.

### Tasks
- [ ] **#19 - Training Centers**:
  - **Current**: *"Select your city and neighborhood center below to view morning timings, designated grounds, and connect with your Training Center Head (TCH)."*
  - **Recommended**: *"Select your city and neighborhood center below to view morning timings and designated grounds, and connect with your Training Center Head (TCH)."*
  - **Reason**: Corrects parallel grammatical structure.
- [ ] **#20 - Ground Details**:
  - **Current**: *"Tue, Thu, Sat & Sun @ 5:30 AM"*
  - **Recommended**: *"Tue, Thu, Sat & Sun | 5:30 AM"*
  - **Reason**: Cleaner UI wording; avoids informal "@".
'@
    },
    @{
        title = "[Copy Review]: ONCA App, Nutrition & Flagship Races (#21 - #25)"
        body = @'
## Overview
Brand consistency, grammar, and sentence structure updates across **ONCA App**, **Nutrition & Health**, and the **Saree Run**.

### Tasks
- [ ] **#21 - ONCA App**:
  - **Current**: *"The digital gateway to the JJs Running structured training ecosystem."*
  - **Recommended**: *"Your digital gateway to JJs Running’s structured training ecosystem."*
  - **Reason**: Current text is a fragment if treated as prose.
- [ ] **#22 - ONCA App**:
  - **Current**: *"Sync seamlessly with your Garmin, Apple Watch, Coros, or phone GPS."*
  - **Recommended**: *"Sync seamlessly with your Garmin, Apple Watch, COROS device, or phone GPS."*
  - **Reason**: Improves brand/product wording and consistency (COROS).
- [ ] **#23 - Nutrition & Health**:
  - **Current**: *"Pre-race carb loading protocols, hydration guides & gut training."*
  - **Recommended**: *"Pre-race carb-loading protocols, hydration guides, and gut-training strategies."*
  - **Reason**: More natural professional phrasing.
- [ ] **#24 - Flagship Races**:
  - **Current**: *"...iconic women fitness movements..."*
  - **Recommended**: *"...iconic women’s fitness movements..."*
  - **Reason**: Grammatical correction (possessive).
- [ ] **#25 - Saree Run**:
  - **Current**: *"An iconic nationwide fitness movement founded by Jayanagar Jaguars and Coach Pramod Deshpande. Shattering stereotypes by running proud in traditional six-yard sarees and running shoes, celebrating sisterhood, wellness, and self-empowerment."*
  - **Recommended**: *"An iconic nationwide fitness movement founded by Jayanagar Jaguars and Coach Pramod Deshpande, the Saree Run celebrates women who proudly run in traditional six-yard sarees and running shoes, promoting sisterhood, wellness, and self-empowerment."*
  - **Reason**: Second sentence is currently a fragment.
'@
    },
    @{
        title = "[Copy Review]: Transformation Stories, About & Footer (#26 - #31)"
        body = @'
## Overview
Phrasing improvements across **Transformation Stories**, **About / Footer**, and the **Newsletter** subscription banner.

### Tasks
- [ ] **#26 - Transformation Story 1**:
  - **Current**: *"From breathlessness on a 500m jog to a 3:24:12 Boston Qualifier"*
  - **Recommended**: *"From struggling through a 500 m jog to running a 3:24:12 Boston qualifying time"*
  - **Reason**: More natural construction.
- [ ] **#27 - Transformation Story 2**:
  - **Current**: *"Overcame metabolic syndrome to conquer Malnad 100K"*
  - **Recommended**: *"Overcoming metabolic syndrome to conquer the Malnad 100K"*
  - **Reason**: More natural headline construction.
- [ ] **#28 - Transformation Story 3**:
  - **Current**: *"Joined Fitness Thru Running at 43 years old, now podium regular"*
  - **Recommended**: *"Joined Fitness Thru Running at age 43 and is now a regular on the podium"*
  - **Reason**: Fixes incomplete grammatical construction.
- [ ] **#29 - About / Footer**:
  - **Current**: *"At JJs Running, we recognize that goals for fitness or endurance sports are achieved only by scientific planning and dedicated community training."*
  - **Recommended**: *"At JJs Running, we believe that fitness and endurance goals are best achieved through scientific planning and dedicated community training."*
  - **Reason**: More natural, concise English.
- [ ] **#30 - About / Footer**:
  - **Current**: *"...our mission is to empower everyday individuals into lifelong endurance athletes."*
  - **Recommended**: *"...our mission is to help everyday individuals become lifelong endurance athletes."*
  - **Reason**: "Empower someone into" is grammatically awkward.
- [ ] **#31 - Newsletter**:
  - **Current**: *"Receive weekly endurance science, nutrition strategies, and marathon race calendar alerts."*
  - **Recommended**: *"Receive weekly insights on endurance science, nutrition strategies, and marathon race calendars."*
  - **Reason**: Improves natural flow and readability.
'@
    }
)

Write-Host "Creating 6 section-based issues in $Repo..." -ForegroundColor Cyan

$uri = "https://api.github.com/repos/$Repo/issues"

foreach ($item in $issues) {
    # Ensure clean UTF-8 JSON payload
    $payloadObj = [PSCustomObject]@{
        title = $item.title
        body  = $item.body
    }
    $json = $payloadObj | ConvertTo-Json -Depth 5 -Compress

    try {
        $resp = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($json)) -ContentType "application/json; charset=utf-8"
        Write-Host " [CREATED] Issue #$($resp.number): $($resp.title)" -ForegroundColor Green
        Write-Host "   URL: $($resp.html_url)" -ForegroundColor DarkGray
    }
    catch {
        $errStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errStream)
        $errBody = $reader.ReadToEnd()
        Write-Error "Failed to create issue '$($item.title)': $errBody"
    }
}

Write-Host "`nAll issues processed!" -ForegroundColor Green
