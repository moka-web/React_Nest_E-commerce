import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from '../services/notification.service';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({ summary: 'Get user notifications' })
  @ApiResponse({ status: 200, description: 'Notifications retrieved' })
  @Get()
  async findAll(@Req() req: any, @Query('limit') limit?: string) {
    const userId = req.user.id;
    const notifications = await this.notificationService.findByUser(
      userId,
      limit ? parseInt(limit) : 20,
    );
    return notifications;
  }

  @ApiOperation({ summary: 'Get unread count' })
  @ApiResponse({ status: 200, description: 'Unread count' })
  @Get('unread-count')
  async getUnreadCount(@Req() req: any) {
    const userId = req.user.id;
    const count = await this.notificationService.getUnreadCount(userId);
    return { count };
  }

  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    await this.notificationService.markAsRead(+id);
    return { success: true };
  }

  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  @Patch('read-all')
  async markAllAsRead(@Req() req: any) {
    const userId = req.user.id;
    await this.notificationService.markAllAsRead(userId);
    return { success: true };
  }
}