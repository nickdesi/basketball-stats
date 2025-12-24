import { memo } from 'react';
import { TrendingUp, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';

interface DashboardChartsProps {
    lineData: ChartData<'line'>;
    doughnutData: ChartData<'doughnut'>;
    barData: ChartData<'bar'>;
    chartOptions: ChartOptions<'line' | 'bar'>;
    textColor: string;
    selectedPlayerId: string;
}

const DashboardCharts = memo(({
    lineData,
    doughnutData,
    barData,
    chartOptions,
    textColor,
    selectedPlayerId
}: DashboardChartsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Line Chart */}
            <div className="glass-card p-6 rounded-2xl md:col-span-2">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[var(--color-text)]">
                    <TrendingUp size={20} className="text-[var(--color-neon-blue)]" />
                    Évolution des Points
                </h3>
                <div className="h-[250px]">
                    <Line options={chartOptions as ChartOptions<'line'>} data={lineData} />
                </div>
            </div>

            {/* Doughnut Chart */}
            <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[var(--color-text)]">
                    <PieIcon size={20} className="text-[var(--color-neon-purple)]" />
                    Répartition des Points
                </h3>
                <div className="h-[200px] flex justify-center">
                    <Doughnut
                        key={selectedPlayerId}
                        options={{
                            maintainAspectRatio: false,
                            cutout: '65%', // Thinner donut for modern look
                            animation: {
                                animateRotate: true,
                                animateScale: true,
                                duration: 800,
                                easing: 'easeOutCubic',
                            },
                            plugins: {
                                legend: {
                                    position: 'right',
                                    labels: {
                                        color: textColor,
                                        font: { family: 'var(--font-mono)', size: 11, weight: 600 },
                                        usePointStyle: true,
                                        pointStyle: 'circle',
                                        padding: 16,
                                    }
                                }
                            }
                        }}
                        data={doughnutData}
                    />
                </div>
            </div>

            {/* Bar Chart */}
            <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[var(--color-text)]">
                    <BarChart3 size={20} className="text-[var(--color-neon-green)]" />
                    Performance Moyenne
                </h3>
                <div className="h-[200px]">
                    <Bar options={chartOptions as ChartOptions<'bar'>} data={barData} />
                </div>
            </div>
        </div>
    );
});

DashboardCharts.displayName = 'DashboardCharts';

export default DashboardCharts;
