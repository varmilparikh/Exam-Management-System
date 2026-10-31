# Synthetic site demo data

Run `npm run demo:data` from `backend` to add isolated demo records. The loader creates records with `DEMO` employee codes, `.invalid` email addresses, `Demo` department names, and `DEMO —` exam names. It does not delete records or update existing demo employees, exams, duties, or requests, so actions taken through the site remain intact on reruns.

Before running, set `DATABASE_URL` to the target database and `DEMO_PASSWORD` to a password of at least 12 characters. New demo accounts share that password; reruns preserve existing account passwords. The loader never prints it.

For a Render database, run this in PowerShell from the repository root. It asks for both values through masked prompts and clears them when the command exits:

```powershell
Push-Location .\backend
$secureDbUrl = $null
$secureDemoPassword = $null
$dbPtr = [IntPtr]::Zero
$passwordPtr = [IntPtr]::Zero
try {
    $secureDbUrl = Read-Host 'Render external DATABASE_URL' -AsSecureString
    $secureDemoPassword = Read-Host 'Shared demo account password (12+ characters)' -AsSecureString
    $dbPtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureDbUrl)
    $passwordPtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureDemoPassword)
    $env:DATABASE_URL = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($dbPtr)
    $env:DEMO_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPtr)
    npm run demo:data
} finally {
    Remove-Item Env:DATABASE_URL,Env:DEMO_PASSWORD -ErrorAction SilentlyContinue
    if ($dbPtr -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($dbPtr) }
    if ($passwordPtr -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPtr) }
    if ($null -ne $secureDbUrl) { $secureDbUrl.Dispose() }
    if ($null -ne $secureDemoPassword) { $secureDemoPassword.Dispose() }
    Pop-Location
}
```

Demo logins created:

| Role | Email |
| --- | --- |
| SUPER_ADMIN | `demo.admin@demo.invalid` |
| COE | `demo.coe@demo.invalid` |
| HOD | `demo.hod.ce@demo.invalid` |
| HOD | `demo.hod.it@demo.invalid` |
| FACULTY | `demo.faculty01@demo.invalid` |
| FACULTY | `demo.faculty02@demo.invalid` |
| FACULTY | `demo.faculty03@demo.invalid` |
| FACULTY | `demo.faculty04@demo.invalid` |
| FACULTY | `demo.faculty05@demo.invalid` |
| FACULTY | `demo.faculty06@demo.invalid` |
| FACULTY | `demo.faculty07@demo.invalid` |

The demo data covers upcoming, active, completed, and cancelled exams, assigned and completed duties, opt-ins, pending and accepted transfers, pending and rejected swaps, notifications, approval requests, and activity history.
