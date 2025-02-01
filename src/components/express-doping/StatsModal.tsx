import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Award, Timer, Target, Brain } from "lucide-react";
import { motion } from 'framer-motion';

interface StatsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: {
    answers: {
      correct: number;
      total: number;
      avgTime: number;
      timeHistory: number[];
      subjectPerformance: {
        subject: string;
        correct: number;
        total: number;
      }[];
    };
    achievements: {
      id: string;
      title: string;
      description: string;
      icon: React.ReactNode;
      earnedAt: Date;
    }[];
    rankHistory: {
      date: string;
      rank: number;
    }[];
  };
}

export const StatsModal: React.FC<StatsModalProps> = ({
  open,
  onOpenChange,
  stats
}) => {
  const accuracy = (stats.answers.correct / stats.answers.total) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detaylı İstatistikler</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Özet Kartları */}
          <div className="grid grid-cols-4 gap-4">
            {[
              {
                title: "Doğruluk",
                value: `%${accuracy.toFixed(1)}`,
                icon: <Target className="w-5 h-5 text-green-500" />,
                color: "bg-green-50",
              },
              {
                title: "Ort. Süre",
                value: `${stats.answers.avgTime.toFixed(1)}s`,
                icon: <Timer className="w-5 h-5 text-blue-500" />,
                color: "bg-blue-50",
              },
              {
                title: "Rozetler",
                value: stats.achievements.length.toString(),
                icon: <Award className="w-5 h-5 text-yellow-500" />,
                color: "bg-yellow-50",
              },
              {
                title: "Toplam Soru",
                value: stats.answers.total.toString(),
                icon: <Brain className="w-5 h-5 text-purple-500" />,
                color: "bg-purple-50",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={stat.color}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      {stat.icon}
                      <span className="text-2xl font-bold">{stat.value}</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">{stat.title}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Sıralama Grafiği */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Sıralama Geçmişi</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.rankHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis reversed />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="rank" 
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Konu Performansı */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Konu Bazlı Performans</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.answers.subjectPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="correct" 
                      stackId="a" 
                      fill="#22C55E"
                      name="Doğru"
                    />
                    <Bar 
                      dataKey="total" 
                      stackId="a" 
                      fill="#EF4444"
                      name="Yanlış"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Rozetler */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Kazanılan Rozetler</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {stats.achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-br from-yellow-50 to-white rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {achievement.icon}
                      <div>
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {achievement.earnedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatsModal;