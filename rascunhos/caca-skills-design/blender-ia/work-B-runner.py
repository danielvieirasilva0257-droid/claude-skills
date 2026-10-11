import subprocess, sys, time, resource
def stat():
    v=list(map(int,open('/proc/stat').readline().split()[1:]))
    return sum(v)-v[3]-v[4]
t=time.time(); s0=stat()
p=subprocess.run(sys.argv[1:], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
w=time.time()-t; ru=resource.getrusage(resource.RUSAGE_CHILDREN); my=ru.ru_utime+ru.ru_stime
tot=(stat()-s0)/100.0
print(f"exit={p.returncode} wall={w:.1f}s myCPU={my:.1f}s allCPU={tot:.1f}s others={max(tot-my,0):.1f}s")
for l in p.stdout.splitlines():
    if 'Saved' in l or 'Error' in l or 'Traceback' in l: print(l[:160])
