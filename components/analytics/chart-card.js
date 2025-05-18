"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend
} from 'recharts'

export function ChartCard({ 
  title, 
  description, 
  data, 
  type = "area", 
  dataKey = "value",
  categories = [],
  colors = ["#10b981", "#6366f1", "#f97316", "#8b5cf6", "#ec4899"]
}) {
  const renderChart = () => {
    switch(type) {
      case "area":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <Tooltip contentStyle={{ borderRadius: '6px' }} />
              <Area type="monotone" dataKey={dataKey} stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip contentStyle={{ borderRadius: '6px' }} />
              <Legend />
              {categories.length > 0 ? 
                categories.map((category, index) => (
                  <Bar key={category} dataKey={category} fill={colors[index % colors.length]} />
                )) : 
                <Bar dataKey={dataKey} fill="#10b981" />
              }
            </BarChart>
          </ResponsiveContainer>
        );
        
      case "line":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip contentStyle={{ borderRadius: '6px' }} />
              <Legend />
              {categories.length > 0 ? 
                categories.map((category, index) => (
                  <Line 
                    key={category} 
                    type="monotone" 
                    dataKey={category} 
                    stroke={colors[index % colors.length]} 
                    activeDot={{ r: 8 }}
                  />
                )) : 
                <Line type="monotone" dataKey={dataKey} stroke="#10b981" activeDot={{ r: 8 }} />
              }
            </LineChart>
          </ResponsiveContainer>
        );
        
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={140}
                fill="#8884d8"
                dataKey={dataKey}
                nameKey="name"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '6px' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card className="col-span-full md:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-2">
        {renderChart()}
      </CardContent>
    </Card>
  );
}
