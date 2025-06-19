import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownIcon, ArrowUpIcon, DollarSign, FileText, Package, ShoppingCart } from 'lucide-react';

export async function AdminStats() {
  const stats = [
    {
      title: 'Total Revenue',
      value: `৳ 500`,
      description: `20% from last month`,
      icon: DollarSign,
      trend: 'Trending up',
    },
    {
      title: 'Total Products',
      value: 200,
      description: `10% from last month`,
      icon: Package,
      trend: 'Stable',
    },
    {
      title: 'Total Orders',
      value: 50,
      description: `60% from last month`,
      icon: ShoppingCart,
      trend: 'Trending up',
    },
    {
      title: 'Total Blogs',
      value: 5,
      description: `25% from last month`,
      icon: FileText,
      trend: 'Trending down',
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @4xl/main:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="@container/card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-muted-foreground text-xs">{stat.description}</p>
            <div className="mt-2 flex items-center text-xs">
              {stat.trend === 'Up' || stat.trend === 'Trending up' || stat.trend === 'Strong order growth' || stat.trend === 'Content growing' ? (
                <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              ) : stat.trend === 'Down' || stat.trend === 'Trending down' || stat.trend === 'Order decline' || stat.trend === 'Content decline' ? (
                <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
              ) : null}
              <span
                className={
                  stat.trend === 'Up' || stat.trend === 'Trending up' || stat.trend === 'Strong order growth' || stat.trend === 'Content growing'
                    ? 'text-green-500'
                    : stat.trend === 'Down' || stat.trend === 'Trending down' || stat.trend === 'Order decline' || stat.trend === 'Content decline'
                    ? 'text-red-500'
                    : 'text-muted-foreground'
                }>
                {stat.trend}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
