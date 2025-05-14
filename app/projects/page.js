export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Open Source Projects</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Project cards will go here */}
        <ProjectCard 
          title="Project Alpha"
          description="A powerful open-source tool for data analysis and visualization"
          tags={['JavaScript', 'React', 'Data Visualization']}
          stars={245}
          forks={84}
        />
        <ProjectCard 
          title="CodeCollab"
          description="Real-time collaborative coding platform for distributed teams"
          tags={['TypeScript', 'WebSockets', 'Node.js']}
          stars={189}
          forks={52}
        />
        <ProjectCard 
          title="DevFlow"
          description="Streamline your development workflow with this CI/CD automation tool"
          tags={['Python', 'DevOps', 'Docker']}
          stars={312}
          forks={97}
        />
      </div>
    </div>
  );
}

// Simple project card component
function ProjectCard({ title, description, tags, stars, forks }) {
  return (
    <div className="border border-border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span key={index} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex items-center text-sm text-muted-foreground">
        <span className="flex items-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          {stars}
        </span>
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          {forks}
        </span>
      </div>
    </div>
  );
}