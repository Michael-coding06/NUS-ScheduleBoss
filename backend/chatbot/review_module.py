import praw
import os
from dotenv import load_dotenv


from typing import List, Dict
load_dotenv()
class NUSModuleReview:
    def __init__(self):
        self.reddit = praw.Reddit(
            client_id=os.getenv('REDDIT_ID'),
            client_secret=os.getenv('REDDIT_SECRET'),
            user_agent='NUSModuleReview'
        )
    def search_module(self, module_code: str) -> str:
        """
        Search r/nus for information about a specific module
        
        Args:
            module_code: NUS module code (e.g., "CS2103T", "MA1521")
            
        Returns:
            Summary of what people say about the module
        """
        try:
            subreddit = self.reddit.subreddit('nus')
            posts = list(subreddit.search(module_code, limit =20, time_filter='all'))
            insights = {
                'difficulty': [],
                'workload': [],
                'professor': [],
                'content': [],
                'tips': [],
                'general': []
            }
            for post in posts:
                # text_content = f"{post.title} {post.selftext}".lower()
                post.comments.replace_more(limit = 0)
                for comment in post.comments[:10]:
                    if(hasattr(comment, 'body') and len(comment.body) > 20):
                        comment_text = comment.body.lower()
                        if any(word in comment_text for word in ['hard', 'difficult', 'easy', 'tough', 'simple']):
                                insights['difficulty'].append(comment.body[:200])
                        elif any(word in comment_text for word in ['workload', 'heavy', 'light', 'assignments', 'homework']):
                            insights['workload'].append(comment.body[:200])
                        elif any(word in comment_text for word in ['prof', 'professor', 'lecturer', 'teacher']):
                            insights['professor'].append(comment.body[:200])
                        elif any(word in comment_text for word in ['content', 'topics', 'syllabus', 'learn']):
                            insights['content'].append(comment.body[:200])
                        elif any(word in comment_text for word in ['tip', 'advice', 'recommend', 'suggest']):
                            insights['tips'].append(comment.body[:200])
                        else:
                            insights['general'].append(comment.body[:150])
            summary = self.create_summary(module_code, insights)
            return summary
        except Exception as e:
            return f'Error searching {module_code}'
    def create_summary(self, module_code: str, insights: Dict[str, List[str]]):
        summary = f'Reviews for {module_code}\n\n'
        if insights['difficulty']:
            summary += "🎯 **Difficulty Level:**\n"
            for comment in insights['difficulty'][:3]:  # Top 3 comments
                summary += f"• {comment.strip()}\n"
            summary += "\n"
        
        if insights['workload']:
            summary += "⏰ **Workload:**\n"
            for comment in insights['workload'][:3]:
                summary += f"• {comment.strip()}\n"
            summary += "\n"
        
        if insights['professor']:
            summary += "👨‍🏫 **About Professors:**\n"
            for comment in insights['professor'][:3]:
                summary += f"• {comment.strip()}\n"
            summary += "\n"
        
        if insights['content']:
            summary += "📖 **Course Content:**\n"
            for comment in insights['content'][:3]:
                summary += f"• {comment.strip()}\n"
            summary += "\n"
        
        if insights['tips']:
            summary += "💡 **Tips & Advice:**\n"
            for comment in insights['tips'][:3]:
                summary += f"• {comment.strip()}\n"
            summary += "\n"
        
        if insights['general']:
            summary += "💬 **General Comments:**\n"
            for comment in insights['general'][:5]:
                summary += f"• {comment.strip()}\n"
            summary += "\n"
        
        summary += "⚠️ *Experiences may vary.*"
        
        return summary


def review_module(module_code: str) -> str:
    """
    Get review of NUS module from reddit
    
    Args:
        module_code: NUS module code (e.g., "CS2103T")
        
    Returns:
        Summary of what students say about the module
    """
    review = NUSModuleReview()
    return review.search_module(module_code.upper())
