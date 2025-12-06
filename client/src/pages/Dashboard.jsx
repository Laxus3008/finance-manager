import { useState, useEffect } from 'react';
import API from '../utils/api';
import SpendingSummary from '../components/Dashboard/SpendingSummary';
import CategoryChart from '../components/Dashboard/CategoryChart';
import BudgetAlerts from '../components/Dashboard/BudgetAlerts';
import AiInsights from '../components/Dashboard/AiInsights';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [budget, setBudget] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      // Fetch spending summary
      const summaryRes = await API.get(`/transactions/summary?month=${month}&year=${year}`);
      setSummary(summaryRes.data);

      // Fetch budget
      try {
        const budgetRes = await API.get(`/budgets?month=${month}&year=${year}`);
        setBudget(budgetRes.data);
      } catch (err) {
        console.log('No budget found');
      }

      // Fetch AI analysis
      try {
        const aiRes = await API.get(`/ai/analysis?month=${month}&year=${year}`);
        setAiAnalysis(aiRes.data);
      } catch (err) {
        console.log('No AI analysis found');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const generateAiAnalysis = async () => {
    try {
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      const { data } = await API.post('/ai/analyze', { month, year });
      setAiAnalysis(data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to generate AI analysis');
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Dashboard</h1>
      
      <div className="grid grid-2">
        <SpendingSummary summary={summary} />
        {budget && <BudgetAlerts alerts={budget.alerts} />}
      </div>

      <div className="grid grid-2">
        <CategoryChart categoryTotals={summary?.categoryTotals} />
        <AiInsights analysis={aiAnalysis} onGenerate={generateAiAnalysis} />
      </div>
    </div>
  );
};

export default Dashboard;