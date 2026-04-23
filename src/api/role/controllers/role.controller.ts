import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Auth } from 'src/api/auth/guards/auth.decorator';
import { AssignRoleDto } from '../dto/role.dto';
import { RoleIds } from '../enum/role.enum';
import { RoleService } from '../services/role.service';

@ApiTags('roles')
@ApiBearerAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Auth(RoleIds.Admin)
  @ApiOperation({
    summary: 'Assign role to user',
    description: 'Assign a role to a user (Admin only)',
  })
  @ApiBody({ type: AssignRoleDto })
  @ApiResponse({ status: 201, description: 'Role assigned successfully' })
  @ApiResponse({ status: 404, description: 'User or role not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @Post('assign')
  async assignRoleToUser(@Body() body: AssignRoleDto) {
    return this.roleService.assignRoleToUser(body);
  }
}
