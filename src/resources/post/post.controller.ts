import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/post/post.validation';
import PostService from '@/resources/post/post.service';
import authenticatedMiddleware from '@/middleware/authenticated.middleware';

class PostController implements Controller {
    public path = '/posts';
    public router = Router();
    private PostService = new PostService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}`,
            [authenticatedMiddleware,validationMiddleware(validate.create)],
            this.create
        );
        this.router.get(
            `${this.path}`,
            // validationMiddleware(validate.create),
            this.getPosts
        );
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { title, body } = req.body;

            
            const post = await this.PostService.create(title, body);
            res.status(201).json({ post });
        } catch (error) {
            next(new HttpException(400, 'Cannot create post => ' + error.message));
        }
    };

    private getPosts = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            
            const posts = await this.PostService.get();

            res.status(201).json({ posts });
        } catch (error) {
            next(new HttpException(400, 'Cannot fetch post'));
        }
    };
}

export default PostController;
