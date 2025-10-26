# Contributing to Tripverse

We welcome contributions to Tripverse! This project is open source and thrives on community participation. Whether you're fixing bugs, adding features, or improving documentation, your contributions help make Tripverse better for all travelers.

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **Git** for version control
- **MongoDB** (local or Atlas)
- **Basic knowledge** of React, Node.js, and MongoDB

### Development Setup
1. **Fork the Repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/tripverse.git
   cd tripverse
   ```

2. **Set Up Development Environment**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Create .env file in server directory
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1: Start backend server
   cd server
   npm run dev
   
   # Terminal 2: Start frontend development server
   cd client
   npm run dev
   ```

## 📋 Contribution Guidelines

### Types of Contributions
- **🐛 Bug Fixes**: Report and fix issues
- **✨ New Features**: Add new functionality
- **📚 Documentation**: Improve docs and examples
- **🎨 UI/UX**: Enhance user interface and experience
- **🧪 Testing**: Add or improve tests
- **🔧 Refactoring**: Code quality improvements
- **🌐 Translations**: Add language support

### Code Standards
- **ESLint**: Follow the project's ESLint configuration
- **Prettier**: Use Prettier for code formatting
- **Conventional Commits**: Use conventional commit messages
- **TypeScript**: Use TypeScript for type safety (where applicable)
- **Testing**: Write tests for new features and bug fixes

### Pull Request Process
1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b bugfix/issue-description
   ```

2. **Make Your Changes**
   - Write clean, readable code
   - Add comments for complex logic
   - Update documentation if needed
   - Add tests for new functionality

3. **Test Your Changes**
   ```bash
   # Run tests
   npm test
   
   # Check linting
   npm run lint
   
   # Build to ensure no errors
   npm run build
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new travel story sharing feature"
   # Use conventional commit format
   ```

5. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   # Then create PR on GitHub
   ```

## 🎯 Areas for Contribution

### High Priority
- **🔍 Search Improvements**: Enhanced search algorithms and filters
- **📱 Mobile Responsiveness**: Better mobile experience
- **🌍 Internationalization**: Multi-language support
- **🔒 Security Enhancements**: Security audit and improvements
- **📊 Analytics**: Better user analytics and insights

### Medium Priority
- **🎨 UI Components**: New reusable components
- **📈 Performance**: Optimization and caching
- **🧪 Testing**: Increase test coverage
- **📚 Documentation**: API docs and guides
- **🔧 Developer Tools**: Better development experience

### Low Priority
- **🎨 Themes**: Dark mode and custom themes
- **🔌 Integrations**: Third-party service integrations
- **📱 PWA Features**: Progressive web app capabilities
- **🤖 AI Features**: Enhanced AI capabilities

## 🐛 Reporting Issues

### Before Reporting
- **Search existing issues** to avoid duplicates
- **Check documentation** for solutions
- **Test with latest version** to ensure it's not fixed

### Issue Template
When reporting bugs, please include:
```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g., Windows 10, macOS, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Version: [e.g., 1.0.0]

**Additional Context**
Any other context about the problem.
```

## 💡 Feature Requests

### Before Requesting
- **Check existing features** to avoid duplicates
- **Consider the scope** and complexity
- **Think about user impact** and use cases

### Feature Request Template
```markdown
**Feature Description**
A clear description of the feature.

**Use Case**
Why would this feature be useful?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other solutions you've considered.

**Additional Context**
Any other context or screenshots.
```

## 🏆 Recognition

### Contributors
We recognize all contributors in our project:
- **Code Contributors**: Listed in CONTRIBUTORS.md
- **Documentation Contributors**: Recognized in README
- **Bug Reporters**: Thanked in issue comments
- **Community Helpers**: Acknowledged in discussions

### Contribution Levels
- **🥉 Bronze**: 1-5 contributions
- **🥈 Silver**: 6-15 contributions  
- **🥇 Gold**: 16+ contributions
- **💎 Diamond**: Major feature contributions

## 📞 Getting Help

### Community Channels
- **GitHub Discussions**: For questions and ideas
- **Issues**: For bug reports and feature requests
- **Discord**: Real-time community chat (if available)
- **Email**: Contact maintainers directly

### Resources
- **Documentation**: Comprehensive guides and API docs
- **Code Examples**: Sample implementations
- **Video Tutorials**: Step-by-step guides
- **Community Wiki**: Community-maintained resources

## 📜 Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive environment for all contributors, regardless of:
- Age, body size, disability, ethnicity
- Gender identity and expression
- Level of experience, education
- Nationality, personal appearance
- Race, religion, sexual orientation

### Expected Behavior
- **Be respectful** and inclusive
- **Be collaborative** and constructive
- **Be patient** with newcomers
- **Be professional** in all interactions

### Unacceptable Behavior
- Harassment, trolling, or discrimination
- Personal attacks or inappropriate language
- Spam or off-topic discussions
- Any behavior that makes others uncomfortable

## 📝 License

By contributing to Tripverse, you agree that your contributions will be licensed under the same MIT License that covers the project.

## 🙏 Thank You

Thank you for considering contributing to Tripverse! Every contribution, no matter how small, helps make this platform better for travelers worldwide.

**Happy coding and safe travels! 🌍✈️**

---

## Quick Links

- [README](README.md) - Project overview and setup
- [API Documentation](api_docs/openapi.yaml) - Complete API reference
- [Issues](https://github.com/sameeraherath/tripverse/issues) - Bug reports and feature requests
- [Discussions](https://github.com/sameeraherath/tripverse/discussions) - Community discussions
- [License](LICENSE) - MIT License details
