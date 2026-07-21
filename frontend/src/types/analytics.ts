export interface Analytics{
    activeTasks: number;
    completedToday: number;
    overdueTasks: number;
    statusDistribution: {
        completed: number;
        inProgress: number;
        todo: number;
    };
    priorityBreakdown: {
        high: number;
        medium: number;
        low: number;
    };
}
