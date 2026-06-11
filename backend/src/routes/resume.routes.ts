import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Get all resumes
router.get('/', async (req: Request, res: Response) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.userId, deletedAt: null },
      include: { template: true },
      orderBy: { updatedAt: 'desc' },
    });

    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

// Create resume
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, templateId } = req.body;

    const resume = await prisma.resume.create({
      data: {
        id: uuidv4(),
        userId: req.userId!,
        title: title || 'New Resume',
        templateId: templateId || 'default',
        fontFamily: 'Inter',
        fontSizeBody: 11,
        fontSizeHeadings: 16,
        primaryColor: '#000000',
        sectionOrder: [],
      },
      include: { template: true },
    });

    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create resume' });
  }
});

// Get resume by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const resume = await prisma.resume.findFirst({
      where: { id: req.params.id, userId: req.userId, deletedAt: null },
      include: { sections: { include: { data: true } }, template: true },
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

// Update resume
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { title, fontFamily, fontSizeBody, fontSizeHeadings, primaryColor } = req.body;

    const resume = await prisma.resume.update({
      where: { id: req.params.id },
      data: {
        title,
        fontFamily,
        fontSizeBody,
        fontSizeHeadings,
        primaryColor,
        updatedAt: new Date(),
      },
      include: { template: true },
    });

    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update resume' });
  }
});

// Delete resume
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.resume.update({
      where: { id: req.params.id },
      data: { deletedAt: new Date() },
    });

    res.json({ message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

export default router;
