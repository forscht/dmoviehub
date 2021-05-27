const http = require('http')
const cpuStat = require('cpu-stat')
const humanizeDuration = require('humanize-duration')

const ReportGenerator = customMetrics => async () => {
    const uptime = humanizeDuration(process.uptime() * 1000, { round: true })
    const memUsage = `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`
    let cpuUsage = await new Promise((resolve, reject) => {
        cpuStat.usagePercent((err, percent) => {
            if (err) return reject(err)

            return resolve(percent)
        })
    })
    cpuUsage = `${cpuUsage.toFixed(2)}%`

    return {
        uptime,
        memUsage,
        cpuUsage,
        ...await customMetrics(),
    }
}

module.exports.build = customMetrics => async () => {
    const reportGenerator = ReportGenerator(customMetrics)
    if (process.env.HEALTH_PORT) {
        http.createServer(async (req, res) => {
            if (req.url.startsWith('/health')) {
                const report = await reportGenerator()
                res.writeHead(200)
                res.end(JSON.stringify(report, null, 4))
            } else {
                res.writeHead(404)
                res.end('not found')
            }
        }).listen(process.env.HEALTH_PORT)
        console.log(`==== Health endpoint started on ${process.env.HEALTH_PORT}`)
    }

    return reportGenerator
}
